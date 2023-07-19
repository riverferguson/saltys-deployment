import React, {useState, useEffect} from 'react'
import { Card, Button, Icon, Container, Modal, Grid, Image, Segment, Header } from 'semantic-ui-react';

const Cart = () => {

  const [deleteItem, setDeleteItem] = useState(null);
  const [total, setTotal] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    fetch('/cartitems')
      .then(response => response.json())
      .then(data => {
        setOrderItems(data);
        setTotal(data.reduce((acc, product) => acc + product.price * product.quantity, 0));
      })
      .catch(error => console.log(error));
  }, []);

  const handleAdd = (product) => {
    if (product.quantity >= 0) {
      fetch(`/cartitems/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: product.quantity += 1,
        })
      })
        .then(res => res.json())
        .then(() => updateQuantity(product));
    }
  };

  const handleMinus = (product) => {
    console.log(product.quantity >= 0)
    if (product.quantity >= 1) {
      fetch(`/cartitems/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: product.quantity -= 1,
        })
      })
        .then(res => res.json())
        .then(() => updateQuantity(product));
    } else {
      setDeleteItem(product);
    }
  };

  const handleDelete = (deleteItem) => {
    fetch(`/cartitems/${deleteItem.id}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) {
        setOrderItems(orderItems.filter(orderItem => orderItem.id !== deleteItem.id));
        setDeleteItem(null);
        setTotal(orderItems.filter(orderItem => orderItem.id !== deleteItem.id).reduce((acc, product) => acc + product.price * product.quantity, 0));

      } else {
        throw new Error('Unexpected response');
      }
    })
    .catch(error => console.log(error));
  };

  const updateQuantity = (quantityChange) => {
    const updatedItem = orderItems.map((product) => product.id === quantityChange.id ? quantityChange : product);
    setOrderItems(updatedItem);
    setTotal(updatedItem.reduce((acc, product) => acc + product.price * product.quantity, 0));
  };

  return (
    <Container className='cart'>
    <h2>Cart</h2>
    <Grid centered>
      <Grid.Column width={6}>

    <Card.Group centered>
      {orderItems.map(product => (
        <div key={product.id}>
          <Card fluid color='orange'>
            <Image src={product.image} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <Card.Content header={product.name}/>
            <Card.Content>
              <Button.Group>
                <Button onClick={() => handleMinus(product)}><Icon name='minus' /></Button>
                <Button.Or text={product.quantity} />
                <Button onClick={() => handleAdd(product)}><Icon name='plus' /></Button>
              </Button.Group>
              <Button floated='right' onClick={() => setDeleteItem(product)}><Icon name='trash' /></Button>
            </Card.Content>
          </Card>
          <br/>
        </div>
      ))}
      {orderItems.length === 0 && (
        <Card>
          <Card.Content header='Your Cart is Empty!' />
          <Card.Content>Head to our <a href="/products">Product Page</a> to start an order</Card.Content>
        </Card>
      )}
    </Card.Group>
    </Grid.Column>
    <Grid.Column width={4}>
    <Segment>
      <Header>Total</Header>
      <h2>${total}.00</h2>
    </Segment>
    </Grid.Column>

    <Modal
      open={deleteItem !== null}
      onClose={() => setDeleteItem(null)}
      size='tiny'
    >
      <Modal.Header>Are you sure you want to delete this item?</Modal.Header>
      <Modal.Content>
        <p>{deleteItem && deleteItem.name}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => handleDelete(deleteItem)}>Delete</Button>
        <Button onClick={() => setDeleteItem(null)}>Cancel</Button>
      </Modal.Actions>
    </Modal>
    </Grid>
  </Container>
  )
}

export default Cart