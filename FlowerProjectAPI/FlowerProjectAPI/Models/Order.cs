﻿using System.ComponentModel.DataAnnotations;

namespace FlowerProjectAPI.Models;

public class Order
{
    [Required] public int Id { get; set; }

    public DateTime? DateAndTime { get; }

    [Required] public int ClientId { get; }

    [Required] public IEnumerable<CartItem> ShoppingCart { get; set; }

    public decimal Price { get; set; }

    public string Status { get; set; }

    public Order(int id, int clientId, IEnumerable<CartItem> shoppingCart, decimal price = 0, 
        string status = "New Order", DateTime? dateAndTime = null)
    {
        Id = id;
        DateAndTime = dateAndTime;
        ClientId = clientId;
        ShoppingCart = shoppingCart;
        Price = price;
        Status = status;
    }
}