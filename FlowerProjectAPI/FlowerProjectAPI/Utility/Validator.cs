using System.ComponentModel.DataAnnotations;
using FlowerProjectAPI.Controllers;
using FlowerProjectAPI.Models;

namespace FlowerProjectAPI.Utility;

public static class Validator
{
    public static ValidationResult? ValidatePassword(string password) =>
        password.Length < 6
            ? new ValidationResult("password must be at least 6 symbols long")
            : ValidationResult.Success;

    public static ValidationResult? ValidateRole(string role) =>
        role is "client" or "manager" or "admin"
            ? ValidationResult.Success
            : new ValidationResult($"invalid role name ({role})");

    public static ValidationResult? ValidateShoppingCart(IEnumerable<CartItem> shoppingCart)
    {
        var shoppingList = shoppingCart.ToList();
        
        if (!shoppingList.Any())
        {
            return new ValidationResult("shopping cart is empty");
        }
        
        foreach (var cartItem in shoppingList)
        {
            var item = ItemsController.ReadById(cartItem.Id).Result;

            if (item == null)
            {
                return new ValidationResult($"invalid item id in shopping cart ({cartItem.Id})");
            }

            if (cartItem.Quantity > item.Count)
            {
                return new ValidationResult($"not enough items with id {cartItem.Id} " +
                                            $"in store ({cartItem.Quantity}/{item.Count})");
            }
        }

        return ValidationResult.Success;
    }
}