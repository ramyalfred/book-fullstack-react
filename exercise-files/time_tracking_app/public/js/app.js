class TimerDashboard extends React.Component {

  constructor(props){
    super(props);

    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.createTimer = this.createTimer.bind(this);
    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
  }

    state = {
        timers: [],
    };

   handleEditFormSubmit = (attrs) => {
     this.updateTimer(attrs)
     client.updateTimer(attrs)
   }

    handleCreateFormSubmit = (timer) => {
      this.createTimer(timer);
      client.createTimer(timer);
    };

    handleDeleteTimer = (attrs) => {
      this.setState({
        timers: this.state.timers.filter((timer) => {
          return timer.id != attrs.id;
        }),
      });
      client.deleteTimer(attrs);
      console.log(this.state.timers);
    }

    handleStartClick = (id) => {
      const now = Date.now();
      client.startTimer({id: id, start: now});
    }

    handleStopClick = (id) => {
      const now = Date.now();
      client.stopTimer({id: id, stop: now});
    }

    //Client-side stop
    stopTimer = (id) => {
      const now = Date.now();

      this.setState({
        timers: this.state.timers.map((timer) => {
          if(timer.id == id){
            const lastElapsed = now - timer.runningSince;
            return Object.assign({}, timer, {
              elapsed: lastElapsed + timer.elapsed,
              runningSince: null,
            });
          }else{
            return timer;
          }
        }),
      });
    }

    //Client-side start
    startTimer = (id) => {
      const now = Date.now();

      this.setState({
        timers: this.state.timers.map((timer) => {
          if(timer.id == id){
            return Object.assign({}, timer, {
              runningSince: now
            });
          }else{
            return timer;
          }
        }),
      });
    } 

    //client-side update
    updateTimer = (attrs) => {
      this.setState({
        timers: this.state.timers.map((timer) => {
          if(timer.id == attrs.id){
            return Object.assign({}, timer, {
              title: attrs.title,
              project: attrs.project,
            });
          }else{
            return timer;
          }
        }),
      });
    };

    //Single responsibility principle enables us to use createTimer in other places
    createTimer = (timer) => {
      const t = helpers.newTimer(timer);
      this.setState({
        timers: this.state.timers.concat(t),
      })
    };

    render(){
      return(
        <div className='ui three column centered grid'>
          <div className='column'>
            <EditableTimerList
              timers={this.state.timers}
              handleEditFormSubmit={this.handleEditFormSubmit}
              handleDeleteTimer={this.handleDeleteTimer}
              onStopClick={this.handleStopClick}
              onStartClick={this.handleStartClick}
            />
            <ToggleableTimerForm
              onFormSubmit={this.handleCreateFormSubmit}
            />
        </div>
      </div>
      );
    }

    componentDidMount(){
      this.loadTimersFromServer();
      setInterval(this.loadTimersFromServer,5000);
    }

    loadTimersFromServer = () => {
      client.getTimers((serverTimers) => {
        this.setState({timers: serverTimers});
      });
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
        handleEditFormSubmit={this.props.handleEditFormSubmit}
        handleDeleteTimer={this.props.handleDeleteTimer}
        onStopClick={this.props.onStopClick}
        onStartClick={this.props.onStartClick}
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

  handleEditClick = () => {
    this.openForm();
  }

  handleFormClose = () => {
    this.closeForm();
  }

  handleUpdateSubmit = (attrs) => {
    this.props.handleEditFormSubmit(attrs);
    this.closeForm();
  }

  openForm = () => {
    this.setState({editFormOpen: true});
  }

  closeForm = () => {
    this.setState({editFormOpen: false});
  };

  render(){
    if(this.state.editFormOpen){
      return(
        <TimerForm
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          onFormSubmit={this.handleUpdateSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    }else{
      return(
        <Timer
        id={this.props.id}
        title={this.props.title}
        project={this.props.project}
        elapsed={this.props.elapsed}
        runningSince={this.props.runningSince}
        onEditClick={this.handleEditClick}
        handleDeleteTimer={this.props.handleDeleteTimer}
        onStopClick={this.props.onStopClick}
        onStartClick={this.props.onStartClick}
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
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project,
    })
  };

  render(){
    const submitText = this.props.id ? 'Update' : 'Create';
    return(
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input type='text' value={this.state.title} onChange={this.handleTitleChange} />
            </div>
            <div className='field'>
              <label>Project</label>
              <input type='text' value={this.state.project} onChange={this.handleProjectChange} />
            </div>
            <div className='ui two bottom attached buttons'>
              <button onClick={this.handleSubmit} className='ui basic blue button'>
                {submitText}
              </button>
              <button onClick={this.props.onFormClose} className='ui basic red button'>
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
    this.handleFormClose = this.handleFormClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  state={
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({isOpen: true});
  };

  handleFormClose = () => {
    this.setState({isOpen: false});
  };

  //Toggling the isOpen to off incase of Async operations to create timer
  handleFormSubmit = (timer) => {
    this.setState({isOpen: false});
    this.props.onFormSubmit(timer);
  };

    render(){
        if(this.state.isOpen){
            return(
                <TimerForm 
                  onFormClose={this.handleFormClose}
                  onFormSubmit={this.handleFormSubmit}
                />
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

  state = {
    isRunning: false,
  };

  //Have force update run every 50 ms
  componentDidMount(){
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(),50); 
  }

  handleStartClick = () => {
    this.props.onStartClick(this.props.id);
  }

  handleStopClick = () => {
    this.props.onStopClick(this.props.id);
  }

  //Reset the continous running of force update
  componentWillUnmount(){
    clearInterval(this.forceUpdateInterval);
  }

  onDeleteClick = () => {
    this.props.handleDeleteTimer({id: this.props.id});
  }

    render(){
        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);

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
                      <i className='edit icon' onClick={this.props.onEditClick} />
                    </span>
                    <span className='right floated trash icon'>
                      <i className='trash icon' onClick={this.onDeleteClick}/>
                    </span>
                  </div>
                </div>
                <TimerActionButton 
                  isRunning={!!this.props.runningSince}
                  onStopClick={this.handleStopClick}
                  onStartClick={this.handleStartClick}
                />
            </div>
        );
    }
}

class TimerActionButton extends React.Component{

render(){
  if(this.props.isRunning){
    return(
      <div className='ui bottom attached red basic button' onClick={this.props.onStopClick}>
        Stop
      </div>
    );
  }else{
    return(
      <div className='ui bottom attached blue basic button' onClick={this.props.onStartClick}>
        Start
      </div>
    );
  }
}

}

ReactDOM.render(
  <TimerDashboard />,
  document.getElementById('content')
);