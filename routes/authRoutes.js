const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { loginTiming, verificationTiming } = require('../middlewares/timingMiddlewares');
const { generateRandomString,CaesarCipher } = require('../utils/helpers');
const { sendSecretViaEmail, sendVerificationEmail, sendShiftViaEmail } = require('../utils/emailService');
const passwordSchema = require('../utils/passwordValidator');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: 'Αυτος ο χρήστης υπάρχει ήδη!' });
        }

        if (!passwordSchema.validate(password)) {
            return res.status(400).json({ 
                message: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες, να έχει τουλάχιστον ένα κεφαλαίο γράμμα, τουλάχιστον ένα σύμβολο και να μην έχει κενά' 
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword });
        const verificationToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '24h' });
        newUser.verificationToken = verificationToken;
        sendVerificationEmail(email,verificationToken)
        await newUser.save();
        res.status(201).json({ message: 'O χρήστης δημιουργήθηκε με επιτυχία, παρακαλώ επιβεβαιώστε τον λογαριασμό σας' });
    } catch (err) {
        res.status(500).json({ message: 'Σφάλμα στη δημιουργία νέου χρήστη!' });
        console.error('aek',err);
    }
});

router.post('/login', loginTiming, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Αυτος ο χρήστης δεν υπάρχει' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Αυτος ο λογαριασμός δεν ειναι επιβεβαιωμένος' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const otp = generateRandomString();
            const cipheredOtp = CaesarCipher(otp, user.shift);

            await User.findOneAndUpdate({ email }, { $set: { otp: otp } }, { new: true });

            sendSecretViaEmail(email, cipheredOtp);

            res.status(200).json({ message: 'Επιτυχής σύνδεση. Παρακαλούμε ελέγξτε τα email σας' });
        } else {
            res.status(401).json({ message: 'Λάνθασμένα στοιχεία πρόσβασης!' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Σφάλμα!' });
        console.error(err);
    }
});
router.post('/verify', verificationTiming, async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Ο χρήστης δεν βρέθηκε' });
        }

        const verified = otp === user.otp;
        if (verified) {
            const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        
            res.status(200).json({ 
                message: 'Επιτυχής επιβεβαίωση otp', 
                token: token 
            });
        } else {
            res.status(401).json({ message: 'Λανθασμένος κωδικός!' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Προέκυψε αναπάντεχο σφάλμα' });
    }
});


router.get('/verifyEmail', async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({ message: 'Άκυρο ή ληγμένο token' });
        }

        if (user.verificationToken !== token) {
            return res.status(400).json({ message: 'Άκυρο ή ληγμένο token' });
        }
        let shift = Math.floor(Math.random() * 3) + 3;
        user.isVerified = true;
        user.verificationToken = '';
        sendShiftViaEmail(decoded.email, shift)
        user.shift = shift;
        await user.save();

        res.status(200).json({ message: 'Ο λογαριασμός σας επιβεβαιώθηκε επιτυχώς! Σύντομα Θα λάβετε στο email σας τον μυστικό αριθμό αποκρυπτογράφησης!' });
    } catch (err) {
        console.error('Λάθος', err);
        res.status(500).json({ message: 'Λάθος κατα την επιβεβαίωση του email' });
    }
});

module.exports = router;
