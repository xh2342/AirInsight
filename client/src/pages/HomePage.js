import { Container } from '@mui/material';
function changeBackgroundImg(){
  document.getElementById("page-container").style.backgroundImage = "url(../img/frontpage-background.jpg)";
};

export default function HomePage() {
  changeBackgroundImg();
  return (
    <Container>
      <p className='text' id ='homepage'>Peer-to-peer (P2P) accommodations have scaled up in the wave of enthusiasm 
        for innovative Internet technologies, which challenge the conventional hotel 
        industry. Airbnb has risen as a dominant player of P2P accommodations. There 
        are currently over 4+ million Airbnb hosts worldwide and 6+ million active 
        listings on the platform. There are over 100,000 cities worldwide that have
         Airbnb listings in them. Airbnb has more than 150 million worldwide users 
         that have booked over 1 billion stays. Airbnb has the net worth of $67.6B in 2023, 
         which is higher than almost any of the top hotel corporations, including Marriott (55.54B), 
         Hilton (45.03B), and Hyatt (13.43B). No matter you are an existing or prospective 
         hosts of Airbnb or researchers interested in hospitality or P2P economy, 
         this website could be a gateway to embark on the pricing strategies upon property features, 
         host information, and reviews as well as competitions between Airbnb listings and conventional hotels. 
         Currently, this website only includes the Airbnb listing data of Los Angeles.
      The data of more cities are expected to be included soon!
      </p>
    </Container>
  );
};