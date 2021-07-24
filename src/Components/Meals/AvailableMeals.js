import React, { useEffect, useState } from 'react';

import MealItem from './MealItem/MealItem';
import Card from '../UI/Card';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
	//STORE FETCH DATA THAT WILL BE USED IN THE COMPONENT
	const [meals, setMeals] = useState([]);
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	//ON PAGE LOAD FETCH THE DATA FROM DATABASE
	useEffect(() => {
		setIsLoading(true);
		fetchMealData();
	}, []);

	//FUNCTION DEFINING THE PROCESS OF FETCHING DATA
	const fetchMealData = async (item) => {
		try {
			const response = await fetch(
				'https://orderly-8090c-default-rtdb.europe-west1.firebasedatabase.app/meals.json',
			);
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			const data = await response.json();
			const availableMeals = [];

			for (let key in data) {
				availableMeals.push({
					id: key,
					name: data[key].name,
					description: data[key].description,
					price: data[key].price,
				});
			}
			setMeals(availableMeals);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			setError(error.message);
		}
	};

	//ITERATE THROUGH THE FETCHED DATA TO GENERATE A LIST OF MEALS

	const mealsList = meals.map((meal) => {
		return (
			<MealItem
				id={meal.id}
				key={meal.id}
				name={meal.name}
				description={meal.description}
				price={meal.price}
			/>
		);
	});

	//HANDLE LOADING STATE DURING FETCHING DATA

	let content = <p className='loading'>Found no meals</p>;

	if (meals.length > 0) {
		content = <Card>{mealsList}</Card>;
	}

	if (error) {
		content = <p className='loading'> {error}</p>;
	}

	if (isLoading) {
		content = (
			<p className='loading'>Please wait, the meals are currently loading</p>
		);
	}
	//RENDER THE ACTUAL COMPONENT
	return <section className={classes.meals}>{content}</section>;
};

export default AvailableMeals;
