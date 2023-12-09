import React from "react";
import styles from "../../styles/EventCard.module.css";
import { useRouter } from "next/router";

const EventCard = ({ title, date, location, description }) => {
  const router = useRouter();

  const handleCardClick = () => {
    const eventId = title.toLowerCase().replace(/\s+/g, "-");
    router.push({
      pathname: `/event/${eventId}`,
      query: { title, date, location, description },
    });
    
  };

  return (
    <div className={styles.eventCard} onClick={handleCardClick}>
      <h2>{title}</h2>
      <p>Date: {date}</p>
      <p>Location: {location}</p>
      <p>{description}</p>
    </div>
  );
};

export default EventCard;
