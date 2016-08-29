class Recipe
    @naam = ""
    @prijs = 0
    @ingredienten = []
    
   def initialize(naam, prijs, ingredienten)
      @naam = naam
      @prijs = prijs
      @ingredienten = ingredienten
   end
   
   def getNaam()
      return @naam
   end
    def getPrijs()
        return @prijs
    end
    
    def getIngredienten()
        return @ingredienten
    end
    
    def addIngredient(item)
        if not(@ingredienten.include?(item))
            @ingredienten.push(item)
        end
    end
end