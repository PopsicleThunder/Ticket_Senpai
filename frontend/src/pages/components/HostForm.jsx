import React from "react";
import { useForm } from "@mantine/form";
import {
  NumberInput,
  TextInput,
  Button,
  Box,
  Radio,
  Divider,
  Group,
  Switch,
  ActionIcon,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

// import { DatePicker } from "@mantine/dates";

function HostForm() {
  const [unique, setUnique] = useState("unique");

  const form = useForm({
    initialValues: { name: "", email: "", age: 0 },

    // functions will be used to validate values at corresponding key
    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    //   age: (value) =>
    //     value < 18 ? "You must be at least 18 to register" : null,
    // },
  });

  const uniqueForm = useForm({
    initialValues: {
      employees: [{ name: "", active: false, key: randomId() }],
    },
  });

  const fields = uniqueForm.values.employees.map((item, index) => (
    <Group key={item.key} mt="xs">
      <NumberInput
        placeholder="0"
        withAsterisk
        style={{ flex: 1 }}
        // {...form.getInputProps(`employees.${index}.name`)}
      />
      <NumberInput
        placeholder="0"
        withAsterisk
        style={{ flex: 1 }}
        // {...form.getInputProps(`employees.${index}.name`)}
      />
      <TextInput
        placeholder="John Doe"
        withAsterisk
        style={{ flex: 1 }}
        {...form.getInputProps(`employees.${index}.name`)}
      />
      <ActionIcon
        color="red"
        onClick={() => uniqueForm.removeListItem("employees", index)}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  return (
    <div>
      <Box maw={340} mx="auto">
        <form onSubmit={form.onSubmit(console.log)}>
          <TextInput
            label="Event Name"
            placeholder="ABC"
            // {...form.getInputProps("name")}
          />
          <TextInput
            label="Event Venue"
            placeholder="XYZ street"
            // {...form.getInputProps("name")}
          />
          <TextInput
            label="Event Description"
            placeholder="XYZ street"
            // {...form.getInputProps("name")}
          />

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
            }}
          >
            <Radio.Group
              value={unique}
              onChange={setUnique}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
              }}
            >
              <Radio value="unique" label="Unique" />
              <Radio value="non-unique" label="Non Unique" />
            </Radio.Group>
          </div>

          {unique == "unique" ? (
            <div>
              <Box maw={500} mx="auto" mt={10}>
                {fields.length > 0 ? (
                  <Group mb="xs">
                    <Text fw={500} size="sm" style={{ flex: 1 }}>
                      Id
                    </Text>
                    <Text fw={500} size="sm" style={{ flex: 1 }}>
                      Supply
                    </Text>
                    <Text fw={500} size="sm" style={{ flex: 1 }}>
                      Price
                    </Text>
                  </Group>
                ) : (
                  <Text c="dimmed" ta="center">
                    No one here...
                  </Text>
                )}

                {fields}

                <Group justify="center" mt="md">
                  <Button
                    onClick={() =>
                      uniqueForm.insertListItem("employees", {
                        totalSupply: "",
                        ticketPrice: "",
                        key: randomId(),
                      })
                    }
                  >
                    Add Batch
                  </Button>
                </Group>
              </Box>
            </div>
          ) : (
            <div>
              <NumberInput label="Total Supply" />
              <NumberInput label="Ticket Price" />
            </div>
          )}

          <Button type="submit" mt="sm">
            Create Event
          </Button>
        </form>
      </Box>
    </div>
  );
}

export default HostForm;
