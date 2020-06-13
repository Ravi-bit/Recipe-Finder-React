import React,{Component} from 'react';
import './App.css';
import './index.css';

class App extends Component {
  constructor(){
    super();
    this.state={
      showReceived:false,
      showNotReceived:true,
      showPara:"Type a Dish Name to search for it's ingredient",
      search:"",
      Dish:"",
      category:"",
      area:"",
      ingredients:[],
      times:1,
      image:"",
      instructions:"",
      BlackLoveIcon:true,
      RedLoveIcon:false,
      IconColor:""
    }
}

//Function for update the state of search
searchHandler= e =>{
      this.setState({search : e.target.value});
}

//This function add some functionality to the input
inputHandler = e =>{
    this.setState({times:1});
    e.target.value = e.target.defaultValue;
    this.setState({search:""});
    //console.log("input "+this.state.times);
}

//Function that make Http request
ingredientHandler = ()=>{
    //console.log("Before if:"+this.state.times);
    if(this.state.search && this.state.times<=1){
      var xhr=new XMLHttpRequest();
      var text ="";
      let that=this;
      let url= "https://www.themealdb.com/api/json/v1/1/search.php?s="+this.state.search; //This is the link to make API call 
      xhr.open("GET",url,true);
      xhr.send();
      xhr.onreadystatechange=function(){
        if(this.readyState===4 && this.status===200){
              //console.log(typeof(JSON.parse(this.responseText).meals));
             // console.log(JSON.parse(this.responseText));
              if(JSON.parse(this.responseText).meals!==null){
                var ingredient=JSON.parse(this.responseText).meals[0];
                let Ing=true;
                let i=1;
                let j=1;
                let duplicateMeals=[];
                while(Ing){
                    let a=  "strIngredient"+i;
                    let b= "strMeasure"+j;
                    if((ingredient.hasOwnProperty(a) && ingredient[a] !== null && ingredient[a] !== "")&&(ingredient.hasOwnProperty(b) && ingredient[b] !== null && ingredient[b] !== "")){
                      //console.log(ingredient[a]);
                     //console.log(ingredient[b]);
                     duplicateMeals.push(ingredient[a]+" ---- "+ingredient[b]);
                     i++;
                     j++;
                    }
                    else{
                    Ing=false;
                    }
                }
                that.setState({IconColor:"blackColor"});
                that.setState({times:2});
                that.setState({RedLoveIcon:true});
                that.setState({BlackLoveIcon:false});
                that.setState({showReceived:true});
                that.setState({showNotReceived:false});
                that.setState({ingredients:duplicateMeals});
                that.setState({showPara: text});
                that.setState({Dish: JSON.parse(this.responseText).meals[0].strMeal});
                that.setState({category : JSON.parse(this.responseText).meals[0].strCategory});
                that.setState({area : JSON.parse(this.responseText).meals[0].strArea});
                that.setState({image: JSON.parse(this.responseText).meals[0].strMealThumb});
                that.setState({instructions: JSON.parse(this.responseText).meals[0].strInstructions});  
              }
              else{
                that.setState({times:2});
                that.setState({BlackLoveIcon:true});
                that.setState({RedLoveIcon:false});
                that.setState({IconColor:"blackColor"});
                that.setState({showReceived:false});
                that.setState({showNotReceived:true});
                that.setState({showPara: "No data has been received"});
             } 
        }
      };
    }
}


  //Function for handling the colour of a icon
iconcolorHandler = () =>{
    //console.log("outside "+this.state.IconColor)
    if(this.state.IconColor==="blackColor" && this.state.RedLoveIcon){
           this.setState({IconColor:"redColor"});
           this.setState({RedLoveIcon:false});
           this.setState({BlackLoveIcon: true});
           //console.log("Inside1 "+this.state.IconColor);
    }
    else if(this.state.IconColor==="redColor" && this.state.BlackLoveIcon){
      this.setState({IconColor:"blackColor"});
      this.setState({RedLoveIcon:true});
      this.setState({BlackLoveIcon: false}); 
      //console.log("Inside2 "+this.state.IconColor);
    }
}
render(){
  return (
    <div className="App">
      <header className="heading">Recipe Finder</header>
      <input onClick={this.inputHandler} onChange={this.searchHandler}  className="search" type="text" placeholder="Enter the name of the Dish"></input>
      <button onClick={this.ingredientHandler}className="btn" variant="contained">Get Ingredients</button>
      {this.state.showNotReceived && 
      <div className="para">
          {this.state.showPara}
      </div>
      }
      {this.state.showReceived &&
      <div className="box">
            <header>
                <div className="box-heading">
                  <span className="box-header">{this.state.Dish}</span>
                  <span onClick={this.iconcolorHandler}  className={this.state.IconColor}>&#9825;</span>
                </div>
            </header>
          <div className="content">
                 <div className="image-area">
                      <img className="Meal-image"src={this.state.image} alt={this.state.Dish}></img>
                 </div>
                 <div className="RecipeList">
                       <div className="Meal-list">
                       <span className="info"> Category of Meal - {this.state.category}</span><br />
                       <span className="info">Area of the Meal - {this.state.area}</span> 
                     </div>
                 <div className="Ingredient-list">
                      <span className="info">Ingredients</span>
                      <div className="Ingredient-box">
                          {this.state.ingredients.map( x => (
                            <p className="space" key={x}>{x}</p>
                          ))}
                      </div>
                 </div>
                 <div className="Instruction-list">
                      <span className="info-last">Recipes</span>
                      <div className="Instruction-box">
                           <div style={{margin:13}}>{this.state.instructions}</div>
                      </div>
                 </div>  
           </div>
         </div>
      </div>}
    </div>
   );
  }
}
export default App;
