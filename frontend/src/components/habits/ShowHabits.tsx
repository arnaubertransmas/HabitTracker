import React from 'react';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

interface Habit {
  id: string;
  name: string;
}

interface ShowHabitsProps {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  handleShowModal: () => void;
}

const ShowHabits: React.FC<ShowHabitsProps> = ({
  habits,
  loading,
  error,
  handleShowModal,
}) => {
  return (
    <Container fluid className="p-3">
      <Row className="mt-5">
        <Col
          md={9}
          className="offset-md-3 d-flex justify-content-center border p-3"
        >
          <Button
            variant="primary"
            type="button"
            size="sm"
            onClick={handleShowModal}
          >
            Create Habit
          </Button>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={8} className="offset-md-3">
          {loading ? (
            <Alert variant="info">Loading Habits...</Alert>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : habits.length === 0 ? (
            <Alert variant="success">There are no habits yet</Alert>
          ) : (
            <Table striped bordered hover className="text-center">
              <thead>
                <tr>
                  <th>Habit</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit, index) => (
                  <tr key={habit.id || index}>
                    <td>{habit.name}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="info" size="sm">
                          Detail
                        </Button>
                        <Button variant="warning" size="sm">
                          Edit
                        </Button>
                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ShowHabits;
