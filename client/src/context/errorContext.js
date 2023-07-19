import React, { useContext, useState, createContext } from 'react';
import { Modal, Button } from 'semantic-ui-react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState("");

  return (
    <ErrorContext.Provider value={{ setError }}>
      {children}
      {error}

      <Modal
        open={error !== ""}
        onClose={() => setError("")}
        size='tiny'
      >
        <Modal.Header>Error</Modal.Header>
        <Modal.Content>
          <p>{error}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setError("")}>Close</Button>
        </Modal.Actions>
      </Modal>
    </ErrorContext.Provider>
  );
};

export function useErrors() {
  return useContext(ErrorContext);
}
