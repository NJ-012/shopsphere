import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark-mode', saved === 'dark');
      document.documentElement.classList.toggle('light-mode', saved === 'light');
    } else {
      // default to dark
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark-mode', newTheme === 'dark');
    document.documentElement.classList.toggle('light-mode', newTheme === 'light');
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 transition-colors"
      aria-label="Toggle light/dark theme"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
