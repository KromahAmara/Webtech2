require 'Recipe'

class WelcomeController < ApplicationController
  @recepten = []
  @recept = nil
  def index
    @recepten = [Recipe.new("Sukiyaki", 35, ['beef', 'tofu', 'negi', 'shungiku', 'shiitake', 'shiratake noodles']),
                 Recipe.new("Kip", 20, ['vlees', 'tomaten', 'paprika'])]
    #Zou normaal maar 1x in de array tevoorschzijn moeten komen
    @recepten[0].addIngredient("duplicate_ingredient")
    @recepten[0].addIngredient("duplicate_ingredient")
    if params[:id]
       @recept = @recepten[params[:id].to_i]
    end
  end
end
