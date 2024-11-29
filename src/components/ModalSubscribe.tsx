import React, { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
// import { Modal, Button } from '@mantine/core';
import { useLocalStorage } from "@mantine/hooks";
import { useIdle } from "@mantine/hooks";
import { Dialog, Group, Button, TextInput, Text } from "@mantine/core";

const ModalSubscribe = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [showPopup, setShowPopup] = useLocalStorage({
    key: "showPopup",
    defaultValue: true,
  });
  const idle = useIdle(7000, { initialState: false });
  // Value is set both to state and localStorage at 'color-scheme'
  // setValue("light");

  useEffect(() => {
    if (idle && showPopup) {
      open();
    }
    // Some logic only to be performed when variable changes OR at initial render
  }, [idle]);

  return (
    // <>
    //   <Modal opened={opened} onClose={close} title="Authentication">
    //     {/* Modal content */}
    //   </Modal>

    // </>
    <>
      <Dialog
        opened={opened}
        withCloseButton
        onClose={() => {
          setShowPopup(false);
          close();
        }}
        size="lg"
        radius="md"
        withBorder
      >
        <Text size="sm" mb="xs" fw={500}>
          Subscribe to email newsletter
        </Text>

        <Group align="flex-end">
          <TextInput placeholder="hello@gluesticker.com" style={{ flex: 1 }} />
          <Button onClick={close}>Subscribe</Button>
        </Group>
      </Dialog>
    </>
  );
};

export default ModalSubscribe;
