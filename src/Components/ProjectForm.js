// import React, {Component} from 'react';
// import Network from '../Components/Requests';

// export default class ProjectForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             complete: false,
//             name: '',
//             desc: ''
//         }

//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//         this.handleChangeText = this.handleChangeText.bind(this);
//     }

//     async handleSubmit(e) {
//         e.preventDefault();
//         await new Network().addUserProject(this.state.name, this.state.desc, 2);

//         this.setState({
//             complete: true
//         });
//     }

//     handleChange(event) {
//         this.setState({name: event.target.value});
//     }

//     handleChangeText(event) {
//         this.setState({desc: event.target.value});
//     }

//     render () {
//         return (
//             <div>
//                 {this.state.complete == true
//                 ?
//                     <div>Отправлено</div>
//                 :
//                     <form className="form-add-pr" onSubmit={this.handleSubmit}>
//                         <input type="text" placeholder="Название проекта" onChange={this.handleChange}/>
//                         <textarea placeholder="Описание проекта" onChange={this.handleChangeText}></textarea>
//                         <input type="submit" placeholder="Добавить"/>
//                     </form>
//                 }
//             </div>
//         )
//     }
// }
