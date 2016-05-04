var React = window.React = require('react'),
    lodash = require('lodash');


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
                    <td>{value.lastGiven}</td>
                    <td>{value.phone}</td>
                    <td>{value.facebook}</td>
                </tr>
                )
        })
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
            showAvailable: false
        }
    },


    componentWillMount: function() {
        var ref = new Firebase("https://bloodgiver.firebaseio.com/People");
        this.bindAsArray(ref, "people");
    },

    componentWillUnmount: function() {
        this.unbind("items");
    },

    handleGetAvailable: function(){
        this.setState({
            showAvailable: true
        })
    },

    render: function(){

        var peopleTable = generatePeopleTable.call(this, this.state.people, this.state.showAvailable)


        return(
            <div>
               {peopleTable}
               <button onClick={this.handleGetAvailable}>Get Available</button>
            </div>
            )
    }
});

module.exports = PeopleList