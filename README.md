# TUP ECE Schedule Management System

A comprehensive class scheduling and management system designed specifically for the Electronics and Communications Engineering (ECE) department at Technological University of the Philippines (TUP).

![TUP ECE Scheduler](https://img.shields.io/badge/TUP-ECE%20Scheduler-red)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF)

## 🚀 Features

### 📅 Schedule Management
- **Visual Schedule Grid**: Interactive weekly schedule view with time slots from 7:00 AM to 9:00 PM
- **Smart Conflict Detection**: Automatically detects and prevents scheduling conflicts for:
  - Room double-booking
  - Faculty scheduling conflicts
  - Section overlapping classes
- **Multiple View Modes**: Filter and view schedules by Section, Room, or Faculty
- **Real-time Updates**: Add, edit, and delete classes with immediate visual feedback

### 🔍 Intelligent Schedule Finder
- **Automated Slot Detection**: Input your requirements and let the system find optimal time slots
- **Flexible Session Splitting**: Automatically suggests splitting longer classes across multiple sessions
- **Multiple Options**: Provides various scheduling alternatives ranked by preference
- **Conflict-Free Suggestions**: Only suggests slots that don't conflict with existing schedules

### 🏫 TUP ECE Specific Features
- **Predefined Rooms**: Pre-configured with ECE department rooms (E34, COE23, COE52, COE43, E20)
- **Custom Room Support**: Add new rooms as needed
- **Section-Based Organization**: Designed for ECE program sections (BSECE 1A, 2B, etc.)
- **Faculty Management**: Track and prevent faculty scheduling conflicts

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0
- **Styling**: Tailwind CSS 4.1.11
- **Icons**: Lucide React 0.525.0
- **Build Tool**: Vite 7.0.4
- **Language**: JavaScript (ES6+)

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tup-ece-scheduler.git
   cd tup-ece-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 How to Use

### Adding a New Class

1. Click the **"Add Class"** button in the header
2. Fill in the required information:
   - Section (e.g., BSECE 3A)
   - Subject (e.g., Digital Signal Processing)
   - Room (select from dropdown or add custom)
   - Faculty name
   - Day of the week
   - Start and end times
3. The system will automatically check for conflicts
4. Click **"Add Class"** to confirm

### Using the Schedule Finder

1. Switch to the **"Schedule Finder"** tab
2. Click **"Find Slots"**
3. Enter your requirements:
   - Section name
   - Subject name
   - Total hours needed (in 0.5-hour increments)
   - Faculty name
4. Click **"Find Slots"** to search
5. Review the suggested options and click **"Use This Option"** to add to your schedule

### Viewing and Filtering Schedules

- **View by**: Choose to organize by Section, Room, or Faculty
- **Filter**: Select a specific section, room, or faculty member to focus on
- **Time Grid**: View all schedules in a weekly grid format
- **Delete**: Hover over any class and click the X to remove it

## 🏗️ Project Structure

```
tup-ece-scheduler/
├── public/
├── src/
│   ├── App.jsx                 # Main application component
│   └── main.jsx               # Application entry point
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js            # Vite configuration
└── README.md                 # Project documentation
```

## ⚙️ Configuration

### Adding New Rooms

To add new predefined rooms, modify the `predefinedRooms` array in `App.jsx`:

```javascript
const predefinedRooms = ['E34', 'COE23', 'COE52', 'COE43', 'E20', 'YOUR_NEW_ROOM'];
```

### Modifying Time Slots

To change available time slots, update the `timeSlots` array in `App.jsx`:

```javascript
const timeSlots = [
  '07:00', '07:30', '08:00', // ... add your preferred times
];
```

### Customizing Theme

The application uses a cardinal red theme. To modify colors, update the Tailwind configuration in `index.html` or create a custom CSS file.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

We welcome contributions to improve the TUP ECE Schedule Management System!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add some amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 🐛 Known Issues & Future Enhancements

### Current Limitations
- Data is stored in browser memory (resets on page refresh)
- No user authentication system
- Limited to single-semester scheduling

### Planned Features
- [ ] Database integration for persistent storage
- [ ] User authentication and role management
- [ ] Multi-semester support
- [ ] Export schedules to PDF/Excel
- [ ] Email notifications for schedule changes
- [ ] Mobile responsive design improvements
- [ ] Integration with TUP student information system

## 🆘 Troubleshooting

### Common Issues

**Q: The application won't start**
- Ensure you have Node.js 16+ installed
- Try deleting `node_modules` and running `npm install` again

**Q: Styles are not loading properly**
- Check that Tailwind CSS is properly configured
- Ensure the CDN link in `index.html` is accessible

**Q: Schedule finder returns no results**
- Try reducing the total hours requirement
- Check if there are existing conflicts with the specified faculty or section

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Technological University of the Philippines ECE Department
- React and Vite development teams
- Tailwind CSS for the styling framework
- Lucide React for the beautiful icons

## 📞 Support

For support, questions, or suggestions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation above

---

**Made with ❤️ for TUP ECE Department**