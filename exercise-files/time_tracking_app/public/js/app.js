class TimerDashboard extends React.Component {

    state = {
        timers: [
          {
            title: 'Practice squat',
            project: 'Gym Chores',
            id: uuid.v4(),
            elapsed: 5456099,
            runningSince: Date.now(),
          },
          {
            title: 'Bake squash',
            project: 'Kitchen Chores',
            id: uuid.v4(),
            elapsed: 1273998,
            runningSince: null,
          },
        ],
    };

    render(){
      return(
        <div className='ui three column centered grid'>
          <div className='column'>
            <EditableTimerList
              timers={this.state.timers}
            />
            <ToggleableTimerForm />
        </div>
      </div>
      );
    }
}

class EditableTimerList extends React.Component{

  render(){
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
      />
    ));
    return(
      <div id='timers'>
        {timers}
      </div>
    );
  }
}

class EditableTimer extends React.Component{
  state={
    editFormOpen: false,
  };

  render(){
    if(this.state.editFormOpen){
      return(
        <TimerForm
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
        />
      );
    }else{
      return(
        <Timer
        title={this.props.title}
        project={this.props.project}
        elapsed={this.props.elapsed}
        runningSince={this.props.runningSince}
      />
      );
    }
  }
}

class TimerForm extends React.Component{

  constructor(props){
    super(props);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
  }

  state={
    title: this.props.title || '',
    project: this.props.project || '',
  };

  handleTitleChange(event){
    this.setState({title: event.target.value});
  }

  handleProjectChange(event){
    this.setState({project: event.target.value});
  }

  render(){
    const submitText = this.props.title ? 'Update' : 'Create';
    return(
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input type='text' value={this.props.title} onChange={this.handleTitleChange} />
            </div>
            <div className='field'>
              <label>Project</label>
              <input type='text' value={this.props.project} onChange={this.handleProjectChange} />
            </div>
            <div className='ui two bottom attached buttons'>
              <button onClick={this.props.handleSubmit} className='ui basic blue button'>
                {submitText}
              </button>
              <button className='ui basic red button'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

class ToggleableTimerForm extends React.Component{

  constructor(props){
    super(props);

    this.handleFormOpen = this.handleFormOpen.bind(this);
  }

  state={
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({isOpen: true});
  };

    render(){
        if(this.state.isOpen){
            return(
                <TimerForm />
            );
        }else{
          return(
            <div className='ui basic content center aligned segment'>
                <button onClick={this.handleFormOpen} className='ui basic button icon'>
                    <i className='plus icon'/>
                </button>
            </div>
          );
        }
    };
}

class Timer extends React.Component{

    render(){
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);

        return(
            <div className='ui centered card'>
                <div className='content'>
                  <div className='header'>
                    {this.props.title}
                  </div>
                  <div className='meta'>
                    {this.props.project}
                  </div>
                  <div className='center aligned description'>
                    <h2>
                      {elapsedString}
                    </h2>
                  </div>
                  <div className='extra content'>
                    <span className='right floated edit icon'>
                      <i className='edit icon' />
                    </span>
                    <span className='right floated trash icon'>
                      <i className='trash icon' />
                    </span>
                  </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                  Start
                </div>
            </div>
        );
    }
}

ReactDOM.render(
  <TimerDashboard />,
  document.getElementById('content')
);