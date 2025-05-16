export const getGreeting = () => {
  const hours = new Date().getHours();

  if (hours < 12) {
    return 'Good Morning';
  } else if (hours < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const formatDate = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const dayOfWeek = days[date.getDay()];
  const month = months[monthIndex];
  const year = date.getFullYear();
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return {
    day,
    month,
    dayOfWeek,
    year,
    time: `${formattedHours}:${formattedMinutes} ${ampm}`,
    formattedDate: `${dayOfWeek}, ${month} ${day}, ${year}`,
  };
};