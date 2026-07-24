// api/heartbeat.js - Pawa-Lite Online-Tracker für Vercel mit kostenloser Firebase-DB

const FIREBASE_DB_URL = "https://pawa-lite-tracker-default-rtdb.europe-west1.firebasedatabase.app/"; // <-- DEINE FIREBASE URL HIER REIN!

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { hwid, user } = req.query;
  const current_time = Math.floor(Date.now() / 1000); // Unix Timestamp
  const timeout_seconds = 120; // 2 Minuten Inaktivität = Offline

  try {
    // 1. Wenn ein Heartbeat vom C#-Client ankommt
    if (hwid && user) {
      const sanitizedHwid = hwid.replace(/[^a-zA-Z0-9_\-]/g, '');
      const sanitizedUser = user.replace(/<[^>]*>/g, '');

      if (sanitizedHwid && sanitizedUser) {
        // Schreibt den Usernamen und den aktuellen Zeitstempel direkt in Firebase (über PUT!)
        const writeUrl = `${FIREBASE_DB_URL}/users/${sanitizedHwid}.json`;
        await fetch(writeUrl, {
          method: 'PUT',
          body: JSON.stringify({
            username: sanitizedUser,
            last_seen: current_time
          })
        });

        return res.status(200).json({ status: 'success' });
      }
    }

    // 2. Wenn du die URL aufrufst (Admin-Abfrage für deine Website):
    // Liest alle User aus Firebase und filtert die inaktiven heraus
    const readUrl = `${FIREBASE_DB_URL}/users.json`;
    const response = await fetch(readUrl).then(r => r.json());
    
    const activeUsers = [];
    if (response) {
      Object.keys(response).forEach(key => {
        const session = response[key];
        // Wenn der User in den letzten 2 Minuten aktiv war:
        if ((current_time - session.last_seen) < timeout_seconds) {
          activeUsers.push(session.username);
        }
      });
    }

    return res.status(200).json({
      status: 'active',
      online_count: activeUsers.length,
      online_users: activeUsers
    });

  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
