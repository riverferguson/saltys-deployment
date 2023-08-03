import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


const ProductCard = ({product, user, addReviewToProduct}) => {
const { name, image, condition, description, price} = product
const [reviewText, setReviewText] = useState("")
const [review, setReview] = useState(product.reviews)
const [error, setError] = useState(null)




  const handleReviewDelete = (reviewId) => {
    fetch(`/reviews/${reviewId.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          setReview((reviews) =>
            reviews.filter((review) => review.id !== reviewId.id)
          );
        } else {
          res.json().then((error) => setError(error.message));
        }
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
      });
  };

const Review = ({ reviewBody, reviewId, handleReviewDelete }) => {
  return (
    <>
      <p>{reviewBody}</p>
      <Button onClick={() => handleReviewDelete({ id: reviewId })}>Delete</Button>
    </>
  );
};


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
      <Card sx={{ maxWidth: 545, margin: '40px' }}>
        <CardMedia component="img" alt={name} height="440" src={image} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body3" color="text.secondary">
            <strong>Description:</strong> {description}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            <strong>Condition:</strong> {condition}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            <strong>Price:</strong> ${price}.00
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small"></Button>
          {user ? (
            <Button size="small" onClick={addToCart}>
              Add To Cart
            </Button>
          ) : null}
        </CardActions>
        <CardActions>
          {user ? (
            <Box
            onSubmit={submitReview}
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Add Review Here" variant="outlined" value={reviewText} onChange={handleReviewChange}/>
            <Button type='submit'>Submit Review</Button>
          </Box>
          ) : null}
        </CardActions>
        {user
          ? review.map((r) => (
              <Review
                key={r.id}
                reviewBody={r.body}
                reviewId={r.id}
                handleReviewDelete={handleReviewDelete}
              />
            ))
          : null}
      </Card>
    </Container>
  );
};

export default ProductCard;