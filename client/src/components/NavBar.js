import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      className='nav-typography'
      style={{
        marginRight: '30px',
        fontFamily: 'Nunito',
        fontWeight: 700,
        letterSpacing: '.1rem',
        userSelect: 'none'
      }}
    >
      <NavLink to={href} className='nav-link'>
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static' id='navbar'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='AirInsights' isMain />
          <NavText href='/property_features' text='Property Features' />
          <NavText href='/host_info' text='Host Information' />
          <NavText href='/hotels' text='Airbnb vs. Hotels' />
          <NavText href='/top_listing' text='Top Listing' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
