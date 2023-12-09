import { Box, Button, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

const Refund = () => {
  const form = useForm({
    initialValues: {},
  });

  return (
    <div>
      <Box maw={340} mx="auto">
        <form onSubmit={form.onSubmit(console.log)}>
          <NumberInput label="Event Id" />
          <NumberInput label="Batch Id" />
          <NumberInput label="Count" />

          <Button type="submit" mt="sm">
            Refund
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default Refund;
