export default function formatDate(dateString: string): string {
    const daysOfWeek = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    const months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
  
    const date = new Date(dateString);
    const dayOfWeekIndex = date.getDay();
    const dayOfMonth = date.getDate();
    const monthIndex = date.getMonth();
  
    const dayOfWeek = daysOfWeek[dayOfWeekIndex];
    const month = months[monthIndex];
  
    return `${dayOfWeek} ${dayOfMonth} ${month}`;
  }