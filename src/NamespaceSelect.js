import "./styles.css";
import { useContext } from "react";
import { Context } from './context'

// useeffect on startup []
// open a websocket and call a list of namespaces
// assign dropdown select items to the state variable, so it updates automagically

export function NamespaceSelect() {
  const namespaces = useContext(Context);

  //console.log(namespaces,"Namespace module rendered");
  //</><select onChange={(e) => setNsChoice(e.target.value)}>
  return (<>
        
        <select>
          <option>** Choose a namespace **</option>
          <option>ALL</option>
          {
             namespaces.map( 
                (opts,i)=>{
                  return(<option key={i}>{opts.name}</option>)
                }
             )
          }
        </select>
    </>
  );
}