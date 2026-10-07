import { Router } from 'express';
import { pool } from '../config/db.js';
import {
  createDemoEvent,
  cancelDemoEvent,
  getDemoEventById,
  isDatabaseConnectionError,
  listDemoEvents,
  updateDemoEvent,
} from '../config/demoStore.js';
import { AuthenticatedRequest, verifyTokenMiddleware, authorizeRole } from '../middleware/auth.js';
import { checkAcademicCalendarConflict, findAcademicBlocks } from '../config/academicBlocks.js';
import { categorizeEvent } from '../config/eventCategories.js';

const router = Router();

// GET /api/events - List events with filtering and search
router.get('/', async (req, res) => {
  const { category, search, includeCancelled } = req.query;

  let query = `
    SELECT e.*, u.display_name AS society_name
    FROM events e
    JOIN users u ON e.creator_id = u.id
  `;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (includeCancelled !== 'true') {
    conditions.push(`(e.status IS NULL OR LOWER(e.status) <> 'cancelled')`);
  }

  if (category && category !== 'all') {
    conditions.push(`LOWER(e.category) = LOWER($${values.length + 1})`);
    values.push(String(category).trim());
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    conditions.push(`(e.title ILIKE $${values.length + 1} OR e.description ILIKE $${values.length + 1} OR u.display_name ILIKE $${values.length + 1})`);
    values.push(`%${search.trim()}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY e.start_time ASC';

  try {
    const result = await pool.query(query, values);
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const events = listDemoEvents();
      const selectedCategory = typeof category === 'string' ? category.toLowerCase() : 'all';
      const searchText = typeof search === 'string' ? search.trim().toLowerCase() : '';

      const filtered = events.filter((event) => {
        if (includeCancelled !== 'true' && event.status === 'cancelled') return false;
        const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;
        const matchesSearch = !searchText ||
          event.title.toLowerCase().includes(searchText) ||
          event.description.toLowerCase().includes(searchText) ||
          event.location.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
      });

      return res.status(200).json({
        success: true,
        data: filtered,
      });
    }

    console.error('Fetch events error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to fetch events.',
      },
    });
  }
});

// GET /api/events/:id - Get event details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT e.*, u.display_name AS society_name
       FROM events e
       JOIN users u ON e.creator_id = u.id
       WHERE e.id = $1`,
      [id]
    );

    if (!result.rowCount || result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found.',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const event = getDemoEventById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'EVENT_NOT_FOUND',
            message: 'Event not found.',
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: event,
      });
    }

    console.error('Fetch single event error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to fetch event details.',
      },
    });
  }
});

// POST /api/events - Create event (Society only)
router.post('/', verifyTokenMiddleware, authorizeRole(['society']), async (req: AuthenticatedRequest, res) => {
  const {
    title,
    description,
    category,
    startTime,
    endTime,
    location,
  } = req.body;

  if (!title || !description || !category || !startTime || !location) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Title, description, category, startTime, and location are required.',
      },
    });
  }

  const normalizedCategory = categorizeEvent(title, description, category);

  const startDate = new Date(startTime);
  const endDate = endTime ? new Date(endTime) : null;
  if (Number.isNaN(startDate.getTime()) || startDate <= new Date()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Event start time must be in the future.',
      },
    });
  }

  if (endDate && (Number.isNaN(endDate.getTime()) || endDate <= startDate)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Event end time must be after the start time.',
      },
    });
  }

  const calendarConflict = checkAcademicCalendarConflict(startDate, endDate || startDate);
  if (calendarConflict) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'ACADEMIC_CALENDAR_CONFLICT',
        message: `Events cannot be scheduled during ${calendarConflict.block_name} (${calendarConflict.start_date} to ${calendarConflict.end_date}).`,
      },
      academic_block: calendarConflict,
    });
  }

  const academicBlocks = findAcademicBlocks(startTime, endTime);

  try {
    const result = await pool.query(
      `INSERT INTO events (
        society_id, title, description, category, event_date, end_date,
        location, creator_id, start_time, end_time
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $1, $5, $6)
       RETURNING *`,
      [
        req.user?.id,
        title,
        description,
        normalizedCategory,
        startTime,
        endTime || null,
        location,
      ]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      academic_blocks: academicBlocks,
      message: 'Event created successfully.',
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const created = createDemoEvent({
        creator_id: req.user?.id || 'demo-society-1',
        title,
        description,
        category: normalizedCategory,
        location,
        start_time: startTime,
        end_time: endTime || null,
      });

      return res.status(201).json({
        success: true,
        data: created,
        academic_blocks: academicBlocks,
        message: 'Event created successfully in demo mode.',
      });
    }

    console.error('Create event error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to create event.',
      },
    });
  }
});

// PUT /api/events/:id - Update event (Society Owner only)
router.put('/:id', verifyTokenMiddleware, authorizeRole(['society']), async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, category, startTime, endTime, location } = req.body;
  const normalizedCategory = category ? categorizeEvent(title || '', description || '', category) : undefined;

  try {
    // Check ownership
    const check = await pool.query('SELECT creator_id FROM events WHERE id = $1', [id]);
    if (!check.rowCount || check.rowCount === 0) {
      return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
    }
    if (String(check.rows[0].creator_id) !== String(req.user?.id)) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only edit your own events.' } });
    }

    const result = await pool.query(
      `UPDATE events
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           start_time = COALESCE($4, start_time),
           end_time = COALESCE($5, end_time),
           location = COALESCE($6, location)
       WHERE id = $7
       RETURNING *`,
      [title, description, normalizedCategory, startTime, endTime, location, id]
    );

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Event updated successfully.',
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const eventId = Array.isArray(id) ? id[0] : id;
      const existing = getDemoEventById(eventId);
      if (!existing) {
        return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
      }

      if (String(existing.creator_id) !== String(req.user?.id)) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only edit your own events.' } });
      }

      const updated = updateDemoEvent(eventId, {
        title: title ?? existing.title,
        description: description ?? existing.description,
        category: normalizedCategory ?? existing.category,
        location: location ?? existing.location,
        start_time: startTime ?? existing.start_time,
        end_time: endTime ?? existing.end_time,
      });

      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Event updated successfully in demo mode.',
      });
    }

    console.error('Update event error:', error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Unable to update event.' } });
  }
});

// DELETE /api/events/:id - Delete event (Society Owner only)
router.delete('/:id', verifyTokenMiddleware, authorizeRole(['society']), async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const check = await pool.query('SELECT creator_id FROM events WHERE id = $1', [id]);
    if (!check.rowCount || check.rowCount === 0) {
      return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
    }
    if (String(check.rows[0].creator_id) !== String(req.user?.id)) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only delete your own events.' } });
    }

    await pool.query(
      `UPDATE events
       SET status = 'cancelled'
       WHERE id = $1`,
      [id]
    );
    await pool.query('DELETE FROM rsvps WHERE event_id = $1', [id]);

    return res.status(200).json({
      success: true,
      message: 'Event cancelled successfully.',
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const eventId = Array.isArray(id) ? id[0] : id;
      const existing = getDemoEventById(eventId);
      if (!existing) {
        return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
      }

      if (String(existing.creator_id) !== String(req.user?.id)) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only delete your own events.' } });
      }

      cancelDemoEvent(eventId);
      return res.status(200).json({
        success: true,
        message: 'Event cancelled successfully in demo mode.',
      });
    }

    console.error('Delete event error:', error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Unable to delete event.' } });
  }
});

export default router;
