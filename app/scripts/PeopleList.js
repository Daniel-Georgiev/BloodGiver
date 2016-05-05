var React = window.React = require('react'),
    lodash = require('lodash'),
    TextInput = require('./TextInput');


function generatePeopleTable(collection, showAvailable){
    var people = [];
    var table = <div></div>;
    var tableHead = (
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Last Given</th>
                    <th>Phone</th>
                    <th>Facebook</th>
                  </tr>
                </thead>
                )

    if(collection && collection.length && showAvailable == false){
        people = _.map(collection, function(value, index){
            return(
                <tr key={index}>
                    <td>{value.firstName}</td>
                    <td>{value.lastName}</td>
                    <td><TextInput data={value}/></td>
                    <td>{value.phone}</td>
                    <td>{value.facebook}</td>
                </tr>
                )
        }.bind(this))
    }else if(showAvailable){
        people = generateAvailablePeople.call(this, collection)
    }
    table = <table className="table">
                    {tableHead}
                    <tbody>
                        {people}
                    </tbody>
                </table>
    return table
}



function generateAvailablePeople(collection){
    var people = []
    var currentDate = new Date(); 
    if(collection && collection.length){
        people = _.map(collection, function(value, index){
            var difference = Math.floor((new Date(currentDate) - new Date(value.lastGiven)) / (1000*60*60*24))
            if(difference >= 60)
            return(
                <tr key={index}>
                    <td>{value.firstName}</td>
                    <td>{value.lastName}</td>
                    <td>{value.lastGiven}</td>
                    <td>{value.phone}</td>
                    <td>{value.facebook}</td>
                </tr>
                )
        })
    }

    return people;
}

var PeopleList = React.createClass({
    mixins: [ReactFireMixin],
    
    getInitialState: function(){
        return {
            showAvailable: false,
            isFormHidden: true
        }
    },


    componentWillMount: function() {
        var ref = new Firebase("https://bloodgiver.firebaseio.com/People");
        this.bindAsArray(ref, "people");
    },

    componentWillUnmount: function() {
        this.unbind("people");
    },

    handleGetAvailable: function(){
        this.setState({
            showAvailable: true
        })
    },

    handleGetAll: function(){
        this.setState({
            showAvailable: false
        })
    },
    handleShowForm: function(){
        this.setState({
            isFormHidden: false
        })
    },
    handleAddNewEntry: function(ev){
        ev.preventDefault();
        var newEntry = {
            firstName: ev.target.firstName.value,
            lastName: ev.target.lastName.value,
            lastGiven: ev.target.lastGiven.value,
            phone: ev.target.phone.value,
            facebook: ev.target.facebook.value
        }

        this.firebaseRefs.people.push(newEntry);
        this.setState({
            isFormHidden: true
        });
    },


    render: function(){

        var peopleTable = generatePeopleTable.call(this, this.state.people, this.state.showAvailable)
        var hiddenClass = this.state.isFormHidden == true ? "hidden" : ""

        console.log(this.state)
        return(
            <div>
                {peopleTable}
                {this.state.showAvailable == false ? <button onClick={this.handleGetAvailable}>Get Available</button> : <button onClick={this.handleGetAll}>Get All</button>}<br />
                <button onClick={this.handleShowForm}>Add new</button>
                <form onSubmit={this.handleAddNewEntry} className={hiddenClass}>
                    <div class="form-group">
                        <input type="text" name="firstName" class="form-control" placeholder="First name" ></input>
                    </div>
                    <div class="form-group">
                        <input type="text" name="lastName" class="form-control" placeholder="Last name" ></input>
                    </div>
                    <div class="form-group">
                        <input type="text" name="lastGiven" class="form-control" placeholder="Last given" ></input>
                    </div>
                    <div class="form-group">
                        <input type="text" name="phone" class="form-control" placeholder="phone" ></input>
                    </div>
                    <div class="form-group">
                        <input type="text" name="facebook" class="form-control" placeholder="facebook" ></input>
                    </div>
                    <button type="submit" class="btn btn-default">Submit</button>
                </form>
            </div> 
            )
    }
});

module.exports = PeopleList