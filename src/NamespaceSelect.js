import "./styles.css";
import { useContext } from "react";
import { Context } from './context';
import NavDropdown from 'react-bootstrap/NavDropdown';

// useeffect on startup []
// open a websocket and call a list of namespaces
// assign dropdown select items to the state variable, so it updates automagically

export function NamespaceSelect() {
  const namespaces = useContext(Context);

  //console.log(namespaces,"Namespace module rendered");
  //</><select onChange={(e) => setNsChoice(e.target.value)}>
  return (<>
      <NavDropdown title="Namespace" id="basic-nav-dropdown">
        {
          namespaces.map( 
            (opts,i)=>{
              return(<NavDropdown.Item href="#" key={i}>{opts.name} </NavDropdown.Item>)
            }
          )
        }  
      </NavDropdown>
    </>
  );
}