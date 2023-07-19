import { Link } from "react-router-dom";
import "./index.css";
import { useHistory } from "react-router-dom"
import { Modal, Button } from 'semantic-ui-react';
import { useState } from "react";
import { useErrors } from '../context/errorContext';

const Nav = ({ user, onSign }) => {
const history = useHistory();
const [open, setOpen] = useState(false)
const {setError} = useErrors()

  const handleSignOut = () => {
    fetch('/signout', {
        method: "DELETE",
    }).then((r) => {
        if(r.ok){
            onSign(null)
            setOpen(false)
            history.push('/')
        } else {
            setError('Sign out went wrong. Please try again')
        }
    });
}


  return (
    <>
    <nav className="nav">
      <Link to="/" className="site-title">
        <span className="shop-name">&nbsp; Salty's Surfshop</span>
      </Link>
      <ul>

        <li className="nav-link-wrapper">
          <Link to="/"> Home </Link>
        </li>

        <li className="nav-link-wrapper">
          <Link to="/about"> About </Link>
        </li>

        <li className="nav-link-wrapper">
          <Link to="/products"> Products </Link>
        </li>
        {user ?
        <>
        <li className="nav-link-wrapper">
          <Link to="/cartitems"> Cart </Link>
        </li>
        </>
        : null}
        <li className="nav-link-wrapper">
          {user ? <button onClick={() => setOpen(true)}>SignOut</button> : <Link to="/signin">SignIn</Link>}
        </li>

        <li className="nav-link-wrapper">
          <Link to="/signup">SignUp</Link>
        </li>
      </ul>
    </nav>
    <Modal
    open={open}
    onClose={() => setOpen(false)}
    size='tiny'
  >
    <Modal.Header>SignOut?</Modal.Header>
    <Modal.Content>
      <p>Are you sure you want to sign out?</p>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={handleSignOut}>Ok</Button>
    </Modal.Actions>
  </Modal>
  </>
  );
};

export default Nav;
