// src/components/MenuItemList.js
import { Container, Row, Col } from 'react-bootstrap';
import MenuItem from './MenuItem';



// Example items array; replace with your actual items

   

const MenuItemList = ({ menuItems =[] }) => {
    return (
        <Container>
            <Row>
                {menuItems.map(item => (
                    <Col xs={12} sm={6} md={4} lg={3} key={item.id} className="mb-3">
                        <MenuItem item={item} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MenuItemList;