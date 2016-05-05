var React = window.React = require('react');


var TextInput = React.createClass({
	mixins: [ReactFireMixin],

	getInitialState: function(){
		return{
			isActive: false
		}
	},


	componentWillMount: function() {
        var ref = new Firebase("https://bloodgiver.firebaseio.com/People/" + this.props.data['.key']);
        this.bindAsObject(ref, "person");
    },

	handleOnChange: function(ev){
		this.state.person.lastGiven = ev.target.value;
		this.forceUpdate();

		
	},

	onEnterKeyPress: function(ev){
		if(ev.key == "Enter"){
			var ref = new Firebase("https://bloodgiver.firebaseio.com/People/" + this.props.data['.key']);

			ref.update({lastGiven: ev.target.value})

			this.setState({
				isActive: false
			})
		}
	},

	handleOnClick: function(){
		this.setState({
			isActive : true
		})
	},


	render: function(){
		return(
			<div>
				{
					this.state.isActive == true 
					? <input type="text" value={this.state.person.lastGiven} onKeyDown={this.onEnterKeyPress} onChange={this.handleOnChange}></input> 
					: <span value={this.state.person.lastGiven} onClick={this.handleOnClick}>{this.state.person.lastGiven}</span>
				}
			</div>
		)
	}
})

module.exports = TextInput;