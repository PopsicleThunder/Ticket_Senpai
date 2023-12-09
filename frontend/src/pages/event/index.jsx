import React from 'react'
import { Container, Grid, Col, Text } from '@mantine/core';

import EventCard from '../components/EventCard';

const eventsData = [
  {
    title: 'Sample Event 1',
    date: '2023-12-15',
    location: 'Sample Location 1',
    description: 'This is a sample event description.',
  },
  {
    title: 'Sample Event 2',
    date: '2023-12-20',
    location: 'Sample Location 2',
    description: 'Another sample event description.',
  },
  {
    title: 'Sample Event 1',
    date: '2023-12-15',
    location: 'Sample Location 1',
    description: 'This is a sample event description.',
  },
  {
    title: 'Sample Event 2',
    date: '2023-12-20',
    location: 'Sample Location 2',
    description: 'Another sample event description.',
  },
    {
    title: 'Sample Event 1',
    date: '2023-12-15',
    location: 'Sample Location 1',
    description: 'This is a sample event description.',
  },
  {
    title: 'Sample Event 2',
    date: '2023-12-20',
    location: 'Sample Location 2',
    description: 'Another sample event description.',
  },
];

const event = () => {

  return (
    <Container size="md">
      <Text order={1} align="center" style={{ marginBottom: '20px' }}>
        Event
      </Text>
      <Grid>
        {eventsData.map((event, index) => (
          <Col key={index} span={6} mdSpan={12} lgSpan={6} xlSpan={6}>
            <EventCard {...event} />
          </Col>
        ))}
      </Grid>
    </Container>
  )
}

export default event
