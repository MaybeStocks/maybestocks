import React, { useState } from 'react'

function UserStockInput() {

    const [userInput, setUserInput] = useState("");
    
    const getValue = (event) =>
    {
        console.log('Event:', event.target.value);
        setUserInput(event.target.value);
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("hello", userInput);

    }
  
    return (
    <>
    <div>UserStockInput</div>
    <form>
        <input type='text' onChange={getValue}/>
        <button onClick = {handleSubmit}>Submit</button>
    </form>
    </>
  )
}

export default UserStockInput