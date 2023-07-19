import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const ProductCard = ({product, user, addReviewToProduct}) => {
const { name, image, condition, description, price} = product
const [reviewText, setReviewText] = useState("")
const [review, setReview] = useState(product.reviews)

const Review = ({reviewBody}) => {
  return (
    <>
      <p>{reviewBody}</p>
    </>
  )
}


const addToCart = (e) => {
  e.target.innerText = "Item added";
    fetch('/cartitems', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
    })
    .then(res => {
      if (res.ok) {
        res.json().then(data => {
          console.log(data)
          console.log(`Item successfully added to cart.`)
      })
    }
    })  
    setTimeout(() => {
      e.target.innerText = "Add to Cart";
  }, 2000);
}

const submitReview = (e) => {
  e.preventDefault();
  if (reviewText.trim() === '') {
    return;
  }
  console.log(`user_id: ${user.id}`)
  console.log(`cart_item_id: ${Object.keys(product)}`)

  fetch('/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      user_id: user.id, 
      body: reviewText, 
      product_id: product.id 
    }),
  })
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          addReviewToProduct(product.id, data)
          setReview([...review, data])
          setReviewText("")
        });
      }
    })
    .catch((error) => {
      console.error('Error adding review:', error);
    });
};
const handleReviewChange = (event) => {
  setReviewText(event.target.value);
};

  return (
    <Container maxWidth="sm">
    <Card sx={{ maxWidth: 545, margin: '40px'}}>
      <CardMedia
        component="img"
        alt={name}
        height="440"
        src={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
           {name}
        </Typography>
        <Typography variant="body3" color="text.secondary">
        <strong>Description:</strong> {description}
        </Typography>
        <Typography variant="h6" color="text.secondary">
        <strong>Condtion:</strong> {condition}
        </Typography>
        <Typography variant="h5" color="text.secondary">
        <strong>Price:</strong> ${price}.00
        </Typography>
      </CardContent>
      <CardActions>
      <Button size="small">
      </Button>
      { user ?
      <Button sixe="small" onClick={addToCart}> Add To Cart </Button>
        : null }
      </CardActions>
      <CardActions>

        { user? 
  <form onSubmit={submitReview}>
    <textarea
      value={reviewText}
      onChange={handleReviewChange}
      placeholder="Write a review..."
      rows={4}
      cols={50}
    />
  <Button type="submit">Submit Review</Button>
  <h3>Customer Reviews</h3>
  </form>
: null }
  
</CardActions>
  { review.map((r) => (
    <Review key={r.id} reviewBody={r.body} />
  ))}
    </Card>
    </Container>
  );
}


export default ProductCard