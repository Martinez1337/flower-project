using System.ComponentModel.DataAnnotations;
using System.Data;
using FlowerProjectAPI.Models;
using FlowerProjectAPI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Npgsql;
using Validator = FlowerProjectAPI.Utility.Validator;

namespace FlowerProjectAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class OrdersController : ControllerBase
{
    private static Order ReadOrder(IDataRecord dbReader)
    {
        var id = dbReader["id"] as int?;
        var dateAndTime = dbReader["date_and_time"] as DateTime?;
        var clientId = dbReader["client_id"] as int? ?? 0;
        var shoppingCart = JsonConvert.DeserializeObject<List<CartItem>>((dbReader["shopping_cart"] as string)!);
        var price = dbReader["price"] as decimal? ?? 0;
        var status = dbReader["status"] as string;
        
        return new Order(id!.Value, clientId, shoppingCart!, price, status!, dateAndTime);
    }
    
    private static decimal TakeItems(IEnumerable<CartItem> shoppingCart)
    {
        return shoppingCart.Sum(item =>
        {
            new ItemsController().PatchCount(item.Id, item.Count - item.Quantity);
            return item.Price * item.Quantity;
        });
    }
    
    private static async Task Create(Order order)
    {
        const string commandText = 
            @"INSERT INTO orders (id, client_id, shopping_cart, price, status)
              VALUES (@id, @clientId, @shoppingCart, @price, @status)";

        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);
        
        cmd.Parameters.AddWithValue("id", order.Id);
        cmd.Parameters.AddWithValue("clientId", order.ClientId);
        cmd.Parameters.AddWithValue("shoppingCart",
            JsonConvert.SerializeObject(order.ShoppingCart.ToDictionary(item => item.Id, item => item.Quantity)));
        cmd.Parameters.AddWithValue("price", order.Price);
        cmd.Parameters.AddWithValue("status", order.Status);

        await cmd.ExecuteNonQueryAsync();
    }
    
    private static async Task CreateWithDefaultId(Order order)
    {
        const string commandText = 
            @"INSERT INTO orders (client_id, shopping_cart, price, status)
              VALUES (@clientId, @shoppingCart, @price, @status)";

        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);
        
        cmd.Parameters.AddWithValue("clientId", order.ClientId);
        cmd.Parameters.AddWithValue("shoppingCart", 
            JsonConvert.SerializeObject(order.ShoppingCart.ToDictionary(item => item.Id, item => item.Quantity)));
        cmd.Parameters.AddWithValue("price", order.Price);
        cmd.Parameters.AddWithValue("status", order.Status);

        await cmd.ExecuteNonQueryAsync();
    }
    
    private static async Task<int?> GetCurrentId()
    {
        const string commandText = @"SELECT last_value FROM orders_id_seq";

        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);

        return cmd.ExecuteNonQueryAsync().Result;
    }
    
    private static async Task<List<Order>?> ReadAllOrders()
    {
        var orders = new List<Order>();

        const string commandText = 
            @"SELECT o.id, o.date_and_time, o.client_id, o.price, o.status,
            json_agg(json_build_object(
                'id', i.id, 
                'name', i.name, 
                'categoryId', i.category_id,
                'categoryName', c.name,
                'price', i.price,
                'count', i.count,
                'quantity', s.quantity,
                'description', i.description,
                'image', i.image)) AS shopping_cart
            FROM orders o
            JOIN LATERAL jsonb_each_text(o.shopping_cart::jsonb) s(item_id, quantity) ON true
            JOIN items i ON i.id = s.item_id::int
            JOIN categories c ON c.id = i.category_id::int
            GROUP BY o.id";

        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            orders.Add(ReadOrder(reader));
        }

        await reader.DisposeAsync();

        return orders;
    }
    
    private static async Task<Order?> ReadById(int id)
    {
        const string commandText = 
            @"SELECT o.id, o.date_and_time, o.client_id, o.price, o.status,
            json_agg(json_build_object(
                'id', i.id, 
                'name', i.name, 
                'categoryId', i.category_id,
                'categoryName', c.name,
                'price', i.price,
                'count', i.count,
                'quantity', s.quantity,
                'description', i.description,
                'image', i.image)) AS shopping_cart
            FROM orders o
            JOIN LATERAL jsonb_each_text(o.shopping_cart::jsonb) s(item_id, quantity) ON true
            JOIN items i ON i.id = s.item_id::int
            JOIN categories c ON c.id = i.category_id::int
            WHERE o.id = @id
            GROUP BY o.id";
        
        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);
        
        cmd.Parameters.AddWithValue("id", id);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var order = ReadOrder(reader);
            return order;
        }

        await reader.DisposeAsync();
        
        return null;
    }
    
    private static async Task<List<Order>?> ReadByClientId(int clientId)
    {
        var orders = new List<Order>();

        const string commandText = 
            @"SELECT o.id, o.date_and_time, o.client_id, o.price, o.status,
            json_agg(json_build_object(
                'id', i.id, 
                'name', i.name, 
                'categoryId', i.category_id,
                'categoryName', c.name,
                'price', i.price,
                'count', i.count,
                'quantity', s.quantity,
                'description', i.description,
                'image', i.image)) AS shopping_cart
            FROM orders o
            JOIN LATERAL jsonb_each_text(o.shopping_cart::jsonb) s(item_id, quantity) ON true
            JOIN items i ON i.id = s.item_id::int
            JOIN categories c ON c.id = i.category_id::int
            WHERE o.client_id = @clientId
            GROUP BY o.id";

        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);
        
        cmd.Parameters.AddWithValue("clientId", clientId);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            orders.Add(ReadOrder(reader));
        }
        
        await reader.DisposeAsync();

        return orders;
    }
    
    private static async Task Update(int id, Order order)
    {
        const string commandText = 
            @"UPDATE orders
              SET id = @id, date_and_time = @dateAndTime, client_id = @clientId, shopping_cart = @shoppingCart, 
                  price = @price, status = @status
              WHERE id = @oldId";

        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);

        cmd.Parameters.AddWithValue("oldId", id);
        cmd.Parameters.AddWithValue("id", order.Id);
        cmd.Parameters.AddWithValue("dateAndTime", order.DateAndTime!);
        cmd.Parameters.AddWithValue("clientId", order.ClientId);
        cmd.Parameters.AddWithValue("shoppingCart", 
            JsonConvert.SerializeObject(order.ShoppingCart.ToDictionary(item => item.Id, item => item.Quantity)));
        cmd.Parameters.AddWithValue("price", order.Price);
        cmd.Parameters.AddWithValue("status", order.Status);

        await cmd.ExecuteNonQueryAsync();
    }
    
    private static async Task DeleteOrder(int id)
    {
        const string commandText = @"DELETE FROM orders WHERE id = (@id)";
        
        await using var cmd = new NpgsqlCommand(commandText, DataBase.Connection);
        
        cmd.Parameters.AddWithValue("id", id);
        
        await cmd.ExecuteNonQueryAsync();
    }
    
    [HttpPost]
    public IActionResult Post(Order order)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (UsersController.ReadById(order.ClientId).Result!.Role != "client")
        {
            return BadRequest("user is not a client");
        }

        order.Price = TakeItems(order.ShoppingCart);

        try
        {
            Create(order).Wait();
        }
        catch (AggregateException e)
        {
            return BadRequest(e.Message);
        }

        return Created("Orders", ReadById(order.Id).Result);
    }
    
    [HttpPost("shoppingCart")]
    public IActionResult PostShoppingCart(int clientId)
    {
        var user = UsersController.ReadById(clientId).Result;
        if (user == null)
        {
            return NotFound("user not found");
        }
        if (user.Role != "client")
        {
            return BadRequest("user is not a client");
        }
    
        var validationResult = Validator.ValidateShoppingCart(user.ShoppingCart!);
        if (validationResult != ValidationResult.Success)
        {
            return BadRequest(validationResult!.ErrorMessage);
        }
        
        var newOrder = new Order(-1, clientId, user.ShoppingCart!, TakeItems(user.ShoppingCart!));
    
        try
        {
            CreateWithDefaultId(newOrder).Wait();
        }
        catch (AggregateException e)
        {
            return BadRequest(e.Message);
        }
    
        var result = ReadById(GetCurrentId().Result!.Value).Result;
    
        new UsersController().PatchShoppingCart(clientId, new List<CartItem>());
    
        return Created("Orders/shoppingCart", result);
    }
    
    [HttpGet]
    public IActionResult Get()
    {
        var result = ReadAllOrders().Result;

        return result == null ? NotFound("orders not found") : Ok(result);
    }
    
    [HttpGet("byId")]
    public IActionResult Get(int id)
    {
        var result = ReadById(id).Result;

        return result == null ? NotFound("order not found") : Ok(result);
    }
    
    [HttpGet("byClientId")]
    public IActionResult GetByClientId(int clientId)
    {
        var result = ReadByClientId(clientId).Result;

        return result == null ? NotFound("orders not found") : Ok(result);
    }
    
    [HttpPut]
    public IActionResult Put(int id, Order order)
    {
        if (Get(id) is NotFoundObjectResult)
        {
            return NotFound("order not found");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            Update(id, order).Wait();
        }
        catch (AggregateException e)
        {
            return BadRequest(e.Message);
        }

        return Ok("order updated successfully");
    }
    
    [HttpPatch("price")]
    public IActionResult PatchPrice(int id, decimal newPrice)
    {
        var result = ReadById(id).Result;
        if (result == null)
        {
            return NotFound("order not found");
        }

        result.Price = newPrice;
        try
        {
            Update(id, result).Wait();
        }
        catch (AggregateException e)
        {
            return BadRequest(e.Message);
        }

        return Ok("order price updated successfully");
    }

    [HttpPatch("status")]
    public IActionResult PatchStatus(int id, string newStatus)
    {
        var result = ReadById(id).Result;
        if (result == null)
        {
            return NotFound("order not found");
        }

        result.Status = newStatus;
        try
        {
            Update(id, result).Wait();
        }
        catch (AggregateException e)
        {
            return BadRequest(e.Message);
        }

        return Ok("order status updated successfully");
    }

    [HttpDelete]
    public IActionResult Delete(int id)
    {
        if (Get(id) is NotFoundObjectResult)
        {
            return NoContent();
        }

        try
        {
            DeleteOrder(id).Wait();
        }
        catch (AggregateException e)
        {
            return BadRequest(e.Message);
        }

        return Ok("order deleted successfully");
    }
}