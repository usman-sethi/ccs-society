import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = 'mongodb+srv://admin:password112@cluster0.dcs1kuc.mongodb.net/society?appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err: any) {
        console.error('Error connecting:', err.message);
        process.exit(1);
    }
};

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    team_name: { type: String },
    description: { type: String, required: true },
    lead_id: { type: String },
    created_at: { type: Date, default: Date.now }
});

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    team_id: { type: String, required: true },
    user_id: { type: String },
    image: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    bio: { type: String, default: '' },
    created_at: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, default: '' },
    registration_link: { type: String, default: '' },
    created_by: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, default: 'info' },
    image: { type: String, default: '' },
    created_by: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const developerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    image: { type: String, default: '' },
    skills: { type: [String], default: [] },
    created_at: { type: Date, default: Date.now }
});

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
const Developer = mongoose.models.Developer || mongoose.model('Developer', developerSchema);

const seed = async () => {
    await connectDB();
    
    // Create Teams
    const team1 = await Team.create({
        name: 'Web Dev',
        team_name: 'Web Development Team',
        description: 'Building the core frontend and backend of our society.',
    });
    
    const team2 = await Team.create({
        name: 'AI & ML',
        team_name: 'Artificial Intelligence Team',
        description: 'Researching and deploying modern AI models.',
    });

    // Create Members
    await Member.create({
        name: 'Usman Sethi',
        role: 'Team Lead',
        team_id: team1._id.toString(),
        bio: 'Web Wizard',
    });
    
    await Member.create({
        name: 'Alice Johnson',
        role: 'Frontend Developer',
        team_id: team1._id.toString(),
        bio: 'React and Tailwind Enthusiast',
    });
    
    await Member.create({
        name: 'John Doe',
        role: 'Machine Learning Engineer',
        team_id: team2._id.toString(),
        bio: 'Python and PyTorch Lover',
    });

    // Create Developers
    await Developer.create({
        name: 'Paradox',
        role: 'Full Stack Developer',
        bio: 'A highly skilled full-stack developer, specializing in creating dynamic, scalable, and responsive web applications.',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS']
    });
    
    await Developer.create({
        name: 'Surveying Univ of Pesh',
        role: 'Visionary & Creator',
        bio: 'A passionate creator and visionary behind the society, leading initiatives to make learning accessive and innovative.',
        skills: ['Leadership', 'Management', 'Visionary']
    });

    // Create Event
    await Event.create({
        title: 'Tech Symposium 2026',
        description: 'An annual gathering of tech enthusiasts to talk about the latest in AI, Web, and more.',
        date: '2026-08-15T10:00:00',
        created_by: 'admin'
    });

    // Create Announcement
    await Announcement.create({
        title: 'New Member Recruitment Drive',
        content: 'We are expanding our teams! If you are interested in Web Development or AI, make sure to apply.',
        type: 'success',
        created_by: 'admin'
    });

    console.log('Seeding Database Completed!');
    process.exit(0);
};

seed();
