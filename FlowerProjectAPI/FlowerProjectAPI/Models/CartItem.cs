namespace FlowerProjectAPI.Models;

public class CartItem : Item
{
    public int Quantity { get; set; }
    
    public CartItem(int id, string name, int categoryId, decimal price, int count, int quantity, 
        string? description = null, string? image = null) 
        : base(id, name, categoryId, price, count, description, image)
    {
        Quantity = quantity;
    }
}