// Faprika. Do not fap do code

class Faprika {

  constructor(){
   if(!Faprika.instance){
     this.models = {};
     Faprika.instance = this;
   }
   return Faprika.instance;
  }

  add(models) {
    Object.assign(this.models, models);
  }

}

export default Faprika;
