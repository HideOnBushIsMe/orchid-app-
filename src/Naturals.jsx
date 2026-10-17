import { useContext } from 'react';
import { OrchidContext } from './OrchidContext';
import OrchidsPresentation from './OrchidsPresentation';
import { Container } from 'react-bootstrap';

export default function Naturals() {
  const { orchids } = useContext(OrchidContext);
  
  // Filter orchids to show only natural ones
  const naturalOrchids = orchids.filter(orchid => orchid.isNatural);

  return (
    <Container fluid>
      <h2 className="mb-4 text-center">Natural Orchids</h2>
      <OrchidsPresentation orchids={naturalOrchids} />
    </Container>
  );
}
