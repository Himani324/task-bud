import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage= () => {
  let list = localStorage.getItem('list');
  if(list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return [];
  }
}
function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage);
  const [isEditing,setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({show: false, msg:'', type:''});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // setAlert({show: true, msg: 'Please enter value', type: 'danger'});
      showAlert(true, 'Please enter value', 'danger');
    } else if(name && isEditing){
      // edit
      setList(list.map((item)=>{
        if (item.id === editId) {
          return{...item, title: name};
        }
        return item;
      }))
      setName('');
      setEditId(null);
      setIsEditing(false);
    } else {
      //alert
      showAlert(true, 'item added to the list', 'success');
      const newItem = {id: new Date().getTime().toString(), title: name}
      setList([...list, newItem])
      setName('')
    }
  }

  const showAlert = (show=false, msg='', type='') => {
    setAlert({show,msg,type})
  }

  const clearList = () => {
    showAlert(true, 'Empty list', 'danger');
    setList([]);
  }

  const removeItem = (id) => {
    showAlert(true, 'Item removed', 'danger');
    const items = list.filter((list) => list.id !== id);
    setList(items);
  }

  const editItem = (id) => {
    const item = list.find((list) => list.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(item.title);
  }

  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list))
  },[list])

  return <section className='section-center'>
    <form className="grocery-form" onSubmit={handleSubmit}>
      {alert.show && <Alert {... alert} removeAlert={showAlert} list={list} />}
      <h3>Your Personal List</h3>
      <div className="form-control">
        <input type="text" className="grocery" placeholder='e.g. item' value={name} onChange={(e) => setName(e.target.value)}/>
        <button type='submit' className="submit-btn">
          {isEditing ? 'edit' : 'submit'}
        </button>
      </div>
    </form>
    {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem = {removeItem} editItem={editItem}/>
          <button className='clear-btn' onClick={clearList}>
            clear items
          </button>
        </div>
    )}
  </section>
}

export default App