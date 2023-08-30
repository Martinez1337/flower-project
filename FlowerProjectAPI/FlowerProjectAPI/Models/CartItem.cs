namespace FlowerProjectAPI.Models;

public class CartItem : Item
{
    public string CategoryName { get; set; }
    
    public int Quantity { get; set; }
    
    public CartItem(int id, string name, int categoryId, string categoryName, decimal price, int count, int quantity, 
        string? description = null, string? image = null) 
        : base(id, name, categoryId, price, count, description, image)
    {
        CategoryName = categoryName;
        Quantity = quantity;
    }
}