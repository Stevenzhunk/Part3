import React, { useEffect, useState } from "react";
import phoneService from "./services/phonebook.jsx";

const Filter = ({ handleFilterChange }) => {
  return (
    <div>
      filter show with:<input onChange={handleFilterChange}></input>
    </div>
  );
};

const PersonForm = ({
  handleSumit,
  newName,
  handleChange,
  newPhone,
  handlePhoneChange,
}) => {
  return (
    <form onSubmit={handleSumit}>
      <div>
        name: <input value={newName} onChange={handleChange} />
      </div>
      <div>
        number: <input value={newPhone} onChange={handlePhoneChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Numbers = ({ showPerson, personDelete, updatePerson }) => {
  const handleOnclickNumber = (person) => {
    const selectedId = person.id;
    confirm("Are you sure wanna delete the element");
    phoneService.deletePerson(selectedId);
    personDelete(showPerson, selectedId);
  };

  return (
    <div>
      {showPerson.map((person) => (
        <div key={person.id}>
          <li>
            {person.name} {person.number}
          </li>
          <button onClick={() => handleOnclickNumber(person)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newfilter, setNewFilter] = useState("");
  const [message, SetNewMessage] = useState(null);
  const [selector, SetSelector] = useState(null);

  const updatePerson = (updatedPerson) => {
    setPersons((prevPersons) =>
      prevPersons.map((person) => {
        if (person.id === updatedPerson.id) {
          return updatedPerson;
        }
        return person;
      })
    );
  };

  useEffect(() => {
    phoneService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  //Handlers
  const handleChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value);
  };
  const handlePhoneChange = (event) => {
    //console.log(event.target.value)
    setNewPhone(event.target.value);
  };

  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    event.preventDefault();
    setNewFilter(event.target.value);
  };

  //function check existense
  const checkExistence = (array, name) =>
    array.some((obj) => obj.name === name);

  const handleSumit = (event) => {
    event.preventDefault();
    const result = checkExistence(persons, newName);

    if (result) {
      //alert(`${newName} is already added to phonebook try add other`)
      confirm(
        `the user ${newName} is already added to phonebook you wanna udapte number?`
      );
      function getIdByName(name, array) {
        const foundObject = array.find((obj) => obj.name === name);
        return foundObject ? foundObject.id : null;
      }
      const selectedPhoneId = getIdByName(newName, persons);
      //console.log(selectedPhoneId)
      //console.log(persons)
      const newUpdate = {
        name: newName,
        id: newName,
        number: newPhone,
      };
      phoneService
        .update(selectedPhoneId, newUpdate)
        .then((response) => {
          updatePerson(response);
          SetSelector(true);
          SetNewMessage(
            `the number was updated of ${newUpdate.name} to new phone ${newUpdate.number}`
          ),
            setTimeout(() => {
              SetNewMessage(null);
            }, 4000);
        })

        .catch((error) => {
          SetSelector(false);
          SetNewMessage(`the number of ${newUpdate.name} was already Delete`);
          setTimeout(() => {
            SetNewMessage(null);
          }, 4000);
        });
    } else {
      const newAdd = {
        name: newName,
        number: newPhone,
      };
      phoneService
        .create(newAdd)
        .then((response) => {
          //recover new id generate in backend
          const newPersonWithId = { ...newAdd, id: response.id };
          setPersons(persons.concat(newPersonWithId));
          SetSelector(true);
          SetNewMessage(`Added ${newAdd.name}`);
          setTimeout(() => {
            SetNewMessage(null);
          }, 4000);
        })
        .catch((error) => {
          SetSelector(false);

          SetNewMessage(error.response.data.error);

          console.log(error.response.data.error);
          setTimeout(() => {
            SetNewMessage(null);
          }, 4000);
        });
    }
    setNewName("");
    setNewPhone("");
    SetSelector(null);
  };

  const finderPerson = (obj, name) => {
    //find characters
    name = name.trim().toLowerCase();

    //using filter
    const results = Object.values(obj).filter((item) =>
      item.name.toLowerCase().includes(name)
    );
    return results;
  };

  //show condicional 'array person' or 'finder person if input filter is empy'
  const showPerson =
    newfilter === "" ? persons : finderPerson(persons, newfilter);
  //console.log(newfilter)

  const personDelete = (arry, id) => {
    const updatedPersons = arry.filter((person) => person.id !== id);
    setPersons(updatedPersons);
  };

  const Notification = ({ message, selector }) => {
    if (message === null) {
      return null;
    }

    return (
      <>
        {selector ? (
          <div className="done">{message}</div>
        ) : (
          <div className="error">{message}</div>
        )}
      </>
    );
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} selector={selector} />
      <Filter handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        handleSumit={handleSumit}
        newName={newName}
        handleChange={handleChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Numbers
        showPerson={showPerson}
        personDelete={personDelete}
        updatePerson={updatePerson}
      />
    </div>
  );
};

export default App;
