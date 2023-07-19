import React from "react";
import { Grid, Image } from "semantic-ui-react";

const About = () => {
  return (
    <Grid celled="internally">
      <Grid.Row>
        <Image src={null} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={13} textAlign="center">
          <br></br>
          <h1>Salty's Surfshop</h1>
          <br></br>
          <Grid columns={3} divided>
            <Grid.Column>
              <h3>Email</h3>
              <p>business@saltyssurfshop.com</p>
            </Grid.Column>
            <Grid.Column>
              <h3>Location</h3>
              <p>1221 Kalanianole Hwy.</p>
              <p>Honolulu, HI 96821</p>
            </Grid.Column>
            <Grid.Column>
              <h3>Phone Number</h3>
              <p> 1(800)-222-3434</p>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid.Row>
      <iframe
        title="map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3125.2021743004284!2d-157.89063888194227!3d21.33026462009587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006de3b5b53e35%3A0x77a7136e0d1c8a95!2sUsed%20Surfboards%20Hawaii!5e0!3m2!1sen!2sus!4v1689211568054!5m2!1sen!2sus"
        style={{ border: "0", width: 500, height: 500, margin: "auto" }}
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </Grid>
  );
};

export default About;
