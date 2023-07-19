import { Header, Grid, Image, Segment } from 'semantic-ui-react';


export default function Home() {


  return (
    <div>


      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h2">Salty's Surfshop</Header>
            <Segment>
            At Salty's Surfshop, we are dedicated to providing an exceptional surfing experience to our customers. We understand the thrill and joy that comes from riding the perfect wave, and we strive to share that passion with every surfer who chooses us. Our team is committed to ensuring customer satisfaction by offering expert advice, personalized recommendations, and exceptional service. We believe that building long-lasting relationships with our customers is the key to success in this industry.
            <br/>
            <br/>
            We believe in the power of simplicity. At Salty's Surfshop, we have designed our online platform to be user-friendly, intuitive, and hassle-free. We want our customers to have a seamless shopping experience, from browsing through our wide selection of surfboards, fins, and leashes to making a secure purchase with just a few clicks. We value your time and aim to make the process as simple and straightforward as possible.
            <br/>
            <br/>
            One of our top priorities at Salty's Surfshop is to offer competitive prices without compromising on quality. We understand that surfing can be an expensive hobby, and we want to make it accessible to as many people as possible. That's why we work directly with reputable manufacturers and suppliers to bring you high-quality products at affordable prices. We believe that everyone should have the opportunity to experience the thrill of catching the perfect wave without breaking the bank.
            <br/>
            <br/>
            At Salty's Surfshop, we are not just a retailer; we are a community. We are passionate about the surfing culture and the sense of camaraderie it fosters. We actively engage with our customers through social media, sharing tips, stories, and inspiration to keep the stoke alive. We are dedicated to creating a space where surfers can come together, share their experiences, and find everything they need to fuel their passion for riding the waves. Choose Salty's Surfshop, and join our community of surf enthusiasts today!
            <br/>
            <br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9B0oeodlIGBlTdP6Nv81tZc_3FTpgIIsdDw&usqp=CAU" alt="wave picture" floated="right"/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    )}