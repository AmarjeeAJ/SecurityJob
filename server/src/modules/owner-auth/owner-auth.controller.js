import { asyncHandler } from '../../middleware/error.middleware.js';
import { authenticateOwner } from './owner-auth.service.js';
import { findOwnerById } from './owner-auth.repository.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const owner = await authenticateOwner(email, password);

  req.session.regenerate((err) => {
    if (err) throw err;
    req.session.ownerUserId = owner.id;
    res.json({ success: true, message: 'Logged in successfully.', owner });
  });
});

export const logout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('securityjob.sid');
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

export const session = asyncHandler(async (req, res) => {
  if (!req.session?.ownerUserId) {
    return res.json({ success: true, authenticated: false });
  }

  const owner = await findOwnerById(req.session.ownerUserId);
  if (!owner) {
    return res.json({ success: true, authenticated: false });
  }

  res.json({ success: true, authenticated: true, owner });
});
