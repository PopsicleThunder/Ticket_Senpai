import { useRouter } from "next/router";
import { Image, Container, Text, Button, Grid } from '@mantine/core';

const EventDetails = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const { title, date, location, description } = router.query;

  return (
    <Container size="md">
      <h1>EventDetails: {eventId}</h1>
      <Image
      radius="md"
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      />
      <Grid style={{margin: 20}}>
        <div>
          <Text>
            {date}
          </Text>
          <Text>
            {location}
          </Text>
          <Text>
            {description}
          </Text>
        </div>
      
        <Button variant="filled">Book Now</Button>
      </Grid>
      

    </Container>
  );
};

export default EventDetails;
