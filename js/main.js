const API = "https://api.github.com/users/";

/*en la siguiente línea se crea una instancia 
de la clase Vue  */
const ella = Vue.createApp({
    data() { //en data tenemos los atributos
      return {
        busqueda: null,
        resultado: null, //vacío
        fail: null,
        favoritos: new Map() //donde guardaremos todos los favoritos
      }
    },

    computed: {
      esFavorito() {
        return this.favoritos.has(this.resultado.id)
      },
      /*con esta propiedad computada retornamos el array con todos los favoritos
      pero únicamente los valores, no las keys, para eso usamos values()*/
      TodosFavoritos(){
        return Array.from(this.favoritos.values())
      }
    },

    methods: {
        async Buscar(){
          try {
            const response = await fetch(API + this.busqueda)
          //si ok es false, lanzar el nuevo error
            if(!response.ok) throw new Error ("El usuario no ha sido encontrado. Verifica la información ingresada")
            const data = await response.json()
            this.resultado = data //el true lo cambio por data para guardar toda la info
            this.fail = null
            console.log(data)
            

          } catch (error) {
            this.fail = error
            this.resultado = false
          //finalmente se recomienda limpiar caché de la instancia de Vue
          } finally {
            this.busqueda = null
            //this.resultado = false
          }
            
        },

        addFavorito(){
          //la clave de este map será el id y el valor será el resultado
          this.favoritos.set(this.resultado.id, this.resultado)
          this.UpdateStorage()
        },
        RemoverFavorito(){
          this.favoritos.delete(this.resultado.id)
          this.UpdateStorage()
        },

        /*se pretende guardar en caché la información de los favoritos
        de manera persistente*/
        UpdateStorage(){
          //convertimos el map en una cadena de texto JSON
          window.localStorage.setItem('favoritos', JSON.stringify(this.TodosFavoritos))
        }
    }

  })