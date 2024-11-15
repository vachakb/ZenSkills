const express = require('express');
const pool = require('./db');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: '172493269774-4qr965tabedoqajcv49jpu2btps6sg8v.apps.googleusercontent.com',
      clientSecret: 'GOCSPX-ZL9xEmJQF056XrI3DliG0sKPQq3',
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you can handle user profile
      console.log('Google profile:', profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    // Redirect to welcome page
    res.redirect('/welcome');
  }
);

app.get('/welcome', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.json({
    message: 'Welcome to ZenSkills!',
    user: req.user,
  });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password, isMentor } = req.body;

  try {
    // Insert user data into the "users" table
    const result = await pool.query(
      'INSERT INTO login (email, password, is_mentor) VALUES ($1, $2, $3) RETURNING *',
      [email, password, isMentor]
    );
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.get('/api/register',(req,res) => {
  res.send("register");
})
app.post('/api/register', async (req, res) => {
  console.log("hello")
  const { bio,company,companyOrSchool,confirmPassword,email,
          expertise,gender,interests,isMentor,language,
          location,months,name,password,title,years } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user data into the "users" table
    // const result = await pool.query(
    //   `INSERT INTO users (bio,company,companyOrSchool,confirmPassword,email,expertise,gender,interests,isMentor,language,location,months,name,password,title,years)
    //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;
    //     `,
    //   [bio,company,companyOrSchool,confirmPassword,email,expertise,gender,interests,isMentor,language,location,months,name,password,title,years]
    // );
    // res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    console.log("jhello")

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/',(req,res) => {
  res.status(200).send("Hello World");
})

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
