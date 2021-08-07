
class ProductList extends React.Component {


  constructor(props){
    super(props);

    this.state={
      productList: window.Seed.products,
    };

    this.handleProductUpVote = this.handleProductUpVote.bind(this);
    
  }

  render() {

    return (
      <div className='ui unstackable items'>

        {this.state.productList.sort((a,b) => (b.votes - a.votes)).map((item) => (
          <Product key={'product-' + item.id} {...item} onVote={this.handleProductUpVote}/>
        ))}
        
      </div>
    );
  }

  handleProductUpVote(id){
    console.log(id);

    window.Seed.products.forEach((product) => {
      if (product.id === id) {
        product.votes = product.votes + 1;
      }
    });

    this.setState({
      productList: window.Seed.products
    });
  }
}

class Product extends React.Component {

  constructor(props){
    super(props);

    this.handleUpVote = this.handleUpVote.bind(this);
  }

  render() {
    
    const{id,
      title,
      description,
      url,
      votes,
      submitterAvatarUrl,
      productImageUrl,
      onVote} = this.props;

    return (
      <div className="item">
        <div className="image">
          <img src={productImageUrl}/>
        </div>
        <div className='middle aligned content'>
          <div className='header'>
          <a onClick={this.handleUpVote}>
              <i className='large caret up icon' />
            </a>
            {votes}
          </div>
          <div className='description'>
            <a href={url}>{title}</a>
            <p>{description}</p>
          </div>
          <div className='extra'>
            <span>Submitted by:</span>
            <img
              className='ui avatar image'
              src={submitterAvatarUrl}
            />
          </div>
        </div>
      </div>
    );
  }

  handleUpVote(){
    this.props.onVote(this.props.id);
  }
}

ReactDOM.render(
  <ProductList/>, 
  document.getElementById('content')
);
