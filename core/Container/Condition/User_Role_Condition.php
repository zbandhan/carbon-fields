<?php

namespace Carbon_Fields\Container\Condition;

/**
 * Check if user has a specific role
 * 
 * Operator "CUSTOM" is passed an array of all user roles
 */
class User_Role_Condition extends Condition {
	
	/**
	 * Check if the condition is fulfilled
	 * 
	 * @param  array $environment
	 * @return bool
	 */
	public function is_fulfilled( $environment ) {
		$roles = $environment['roles'];
		
		switch ( $this->get_comparison_operator() ) {
			case '=':
				return in_array( $this->get_value(), $roles );
				break;
			case '!=':
				return ! in_array( $this->get_value(), $roles );
				break;
			case 'IN':
				return count( array_intersect( $roles, $this->get_value() ) ) > 0;
				break;
			case 'NOT IN':
				return count( array_intersect( $roles, $this->get_value() ) ) === 0;
				break;
		}

		return $this->first_supported_comparer_is_correct(
			$roles,
			$this->get_comparison_operator(),
			$this->get_value()
		);
	}
}