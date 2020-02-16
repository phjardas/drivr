import cors from 'cors';
import express from 'express';
import { firestore } from './firebase';
import { validateFirebaseIdToken } from './token';

const app = express();
app.use(cors());
app.use(validateFirebaseIdToken);

app.post('/acceptInvitation', async (req, res) => {
  const { carId, inviteId } = req.body;
  if (!carId || !inviteId) return res.status(400).send({ success: false, status: 400, error: 'Missing parameters' });

  const carDoc = firestore.collection('cars').doc(carId);
  const inviteDoc = carDoc.collection('invites').doc(inviteId);

  const result = await firestore.runTransaction(async (tx) => {
    const inviteSnap = await tx.get(inviteDoc);
    if (!inviteSnap.exists) return { success: false, status: 404, error: 'Invitation not found' };
    const invite = inviteSnap.data();
    if (invite.acceptedBy) return { success: false, status: 409, error: 'This invitation was already accepted' };
    await tx.update(inviteDoc, { acceptedBy: req.user.uid, acceptedAt: new Date() });
    await tx.update(carDoc, { [`users.${req.user.uid}`]: true });
    return { success: true, status: 200 };
  });

  res.status(result.status).send(result);
});

export default app;
