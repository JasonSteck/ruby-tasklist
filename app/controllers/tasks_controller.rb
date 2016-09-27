# CS 4540, Spring 2015
# Written by Paul Hanson and Jason Steck

class TasksController < ApplicationController
  # Basic authentication for one person. 
  # Can be extended with a users model without affecting any other parts of the authentication process.
  http_basic_authenticate_with name: "test", password: "test" 

  before_filter :getCatOptions
  
  def getCatOptions
    # Grab the possible category options
    @categoryOptions = Task.categoryOptions
  end

  def index
    @tasks = Task.all
  end

  def show
    @task = Task.find(params[:id])
  end

  def new
    @task = Task.new
  end

  def edit
    @task = Task.find(params[:id])
  end

  def create
    @task = Task.new(task_params)

    # .save returns false if user input isn't valid
    if @task.save
      redirect_to tasks_path
    else
      render 'new'
    end
  end

  def update
    @task = Task.find(params[:id])
 
    if @task.update(task_params)
      redirect_to tasks_path
    else
      render 'edit'
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
 
    redirect_to tasks_path
  end


  def checkboxAjax
    # we need to return a json object
    require 'json'

    # if task id or isChecked parameters are not passed, end the action 
    if !(params.has_key?(:id) && params.has_key?(:isChecked))
      # Note, this is not considered a valid json value so it will error out on the 
      # other side which is what we want. The message is mainly for someone manually looking at the request.
      render :text => "Error, must send both the id and isChecked variables."
      return 
    end

    # Grab the task we're talking about
    task = Task.find(params[:id].to_i)
    # set the task according to what they want
    if params[:isChecked]=="true"
      task.isComplete = true;
    else
      task.isComplete = false;
    end
    # update the entry in the database
    task.save
    # return a json object letting them know the operation succeeded
    render :text => {succeeded: true}.to_json
  end


  private
    # helper method for determining what parameters are required and allowed
    def task_params
      params.require(:task).permit(:name, :category, :description, :isComplete)
    end

end
