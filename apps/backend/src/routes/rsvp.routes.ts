import { Router } from 'express';
import { pool } from '../config/db.js';
import {
  createDemoRsvp,
  hasDemoRsvp,
  isDatabaseConnectionError,
  listDemoAttendees,
  listDemoMyEvents,
  removeDemoRsvp,
  getDemoEventById,
} from '../config/demoStore.js';
import { AuthenticatedRequest, verifyTokenMiddleware, authorizeRole } from '../middleware/auth.js';

const router = Router();

// POST /api/rsvps - Create RSVP (Student only)
router.post('/', verifyTokenMiddleware, authorizeRole(['student']), async (req: AuthenticatedRequest, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'eventId is required.',
      },
    });
  }

  try {
    // Verify event exists
    const eventResult = await pool.query(
      `SELECT id FROM events WHERE id = $1 AND (status IS NULL OR LOWER(status) <> 'cancelled')`,
      [eventId]
    );
    if (!eventResult.rowCount || eventResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found.',
        },
      });
    }

    // Prevent duplicate RSVP
    const existing = await pool.query(
      'SELECT 1 FROM rsvps WHERE user_id = $1 AND event_id = $2',
      [req.user?.id, eventId]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ALREADY_RSVPED',
          message: 'You already have an RSVP for this event.',
        },
      });
    }

    const result = await pool.query(
      `INSERT INTO rsvps (user_id, event_id)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user?.id, eventId]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'RSVP created successfully.',
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const event = getDemoEventById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'EVENT_NOT_FOUND',
            message: 'Event not found.',
          },
        });
      }

      if (hasDemoRsvp(req.user?.id || '', eventId)) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'ALREADY_RSVPED',
            message: 'You already have an RSVP for this event.',
          },
        });
      }

      const record = createDemoRsvp(req.user?.id || '', eventId);
      return res.status(201).json({
        success: true,
        data: record,
        message: 'RSVP created successfully in demo mode.',
      });
    }

    console.error('Create RSVP error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to create RSVP.',
      },
    });
  }
});

// DELETE /api/rsvps/:eventId - Cancel RSVP (Student only)
router.delete('/:eventId', verifyTokenMiddleware, authorizeRole(['student']), async (req: AuthenticatedRequest, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM rsvps
       WHERE event_id = $1 AND user_id = $2
       RETURNING *`,
      [eventId, req.user?.id]
    );

    if (!result.rowCount || result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RSVP_NOT_FOUND',
          message: 'No RSVP found for this event.',
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'RSVP cancelled successfully.',
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const normalizedEventId = Array.isArray(eventId) ? eventId[0] : eventId;
      const removed = removeDemoRsvp(req.user?.id || '', normalizedEventId);
      if (!removed) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RSVP_NOT_FOUND',
            message: 'No RSVP found for this event.',
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'RSVP cancelled successfully in demo mode.',
      });
    }

    console.error('Cancel RSVP error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to cancel RSVP.',
      },
    });
  }
});

// GET /api/rsvps/my-events - List attending events (Student only)
router.get('/my-events', verifyTokenMiddleware, authorizeRole(['student']), async (req: AuthenticatedRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT r.created_at, e.id, e.title, e.start_time, e.location, e.category
       FROM rsvps r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = $1
       ORDER BY e.start_time ASC`,
      [req.user?.id]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return res.status(200).json({
        success: true,
        data: listDemoMyEvents(req.user?.id || ''),
      });
    }

    console.error('Fetch my events error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to fetch your event RSVPs.',
      },
    });
  }
});

// GET /api/rsvps/event/:eventId - List attendees (Society Owner only)
router.get('/event/:eventId', verifyTokenMiddleware, authorizeRole(['society']), async (req: AuthenticatedRequest, res) => {
  const { eventId } = req.params;

  try {
    // Check ownership
    const eventCheck = await pool.query('SELECT creator_id FROM events WHERE id = $1', [eventId]);
    if (!eventCheck.rowCount || eventCheck.rowCount === 0) {
      return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
    }
    if (String(eventCheck.rows[0].creator_id) !== String(req.user?.id)) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only view attendees for your own events.' } });
    }

    const result = await pool.query(
      `SELECT u.display_name, u.email, r.created_at
       FROM rsvps r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = $1
       ORDER BY r.created_at DESC`,
      [eventId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const normalizedEventId = Array.isArray(eventId) ? eventId[0] : eventId;
      const event = getDemoEventById(normalizedEventId);
      if (!event) {
        return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
      }

      if (String(event.creator_id) !== String(req.user?.id)) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only view attendees for your own events.' } });
      }

      return res.status(200).json({
        success: true,
        data: listDemoAttendees(normalizedEventId),
      });
    }

    console.error('Fetch attendees error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to fetch event attendees.',
      },
    });
  }
});

export default router;
